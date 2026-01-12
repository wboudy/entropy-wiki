#!/usr/bin/env tsx
/**
 * Bidirectional Sync Script: wiki/ ↔ PostgreSQL
 *
 * Syncs content between the wiki/ folder and the database:
 * - Imports: wiki/*.md → Database (new or updated files)
 * - Exports: Database → wiki/*.md (DB-only pages)
 *
 * Usage:
 *   cd api && npx tsx scripts/sync-wiki-db.ts
 *   cd api && npx tsx scripts/sync-wiki-db.ts --dry-run
 *   cd api && npx tsx scripts/sync-wiki-db.ts --import-only
 *   cd api && npx tsx scripts/sync-wiki-db.ts --export-only
 *
 * Requires DATABASE_URL environment variable.
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;

const WIKI_DIR = join(import.meta.dirname, '..', '..', 'wiki');

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const IMPORT_ONLY = args.includes('--import-only');
const EXPORT_ONLY = args.includes('--export-only');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

interface PageData {
  slug: string;
  title: string;
  content_md: string;
  filePath: string;
}

interface DbPage {
  id: string;
  slug: string;
  title: string;
  status: string;
  content_md: string | null;
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;

  const entries = readdirSync(dir);

  for (const entry of entries) {
    // Skip hidden files and _meta.json
    if (entry.startsWith('.') || entry === '_meta.json') continue;

    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract title from markdown content
 * Looks for first # heading or uses filename
 */
function extractTitle(content: string, filePath: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }

  // Fallback to filename
  const filename = basename(filePath, '.md').replace('.mdx', '');
  return filename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Convert file path to URL slug
 * wiki/beads/README.md -> beads
 * wiki/beads/cli-reference.md -> beads/cli-reference
 */
function pathToSlug(filePath: string): string {
  const relativePath = relative(WIKI_DIR, filePath);
  const dir = dirname(relativePath);
  let filename = basename(relativePath, '.md');
  if (filename.endsWith('.mdx')) filename = filename.replace('.mdx', '');

  // README.md becomes just the directory name
  if (filename.toLowerCase() === 'readme') {
    return dir === '.' ? 'home' : dir;
  }

  // Other files become dir/filename
  if (dir === '.') {
    return filename;
  }

  return `${dir}/${filename}`;
}

/**
 * Convert slug to file path
 * beads -> wiki/beads/README.md
 * beads/cli-reference -> wiki/beads/cli-reference.md
 */
function slugToPath(slug: string): string {
  if (slug === 'home' || slug === '') {
    return join(WIKI_DIR, 'home.md');
  }

  const parts = slug.split('/');
  const lastPart = parts[parts.length - 1];

  // Check if it's a section (has subpages) - would be README.md
  const sectionPath = join(WIKI_DIR, ...parts, 'README.md');
  if (existsSync(sectionPath)) {
    return sectionPath;
  }

  // Otherwise it's a regular page
  return join(WIKI_DIR, ...parts.slice(0, -1), `${lastPart}.md`);
}

/**
 * Parse all markdown files into page data
 */
function parseMarkdownFiles(): PageData[] {
  const files = findMarkdownFiles(WIKI_DIR);
  const pages: PageData[] = [];

  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8');
    const slug = pathToSlug(filePath);
    const title = extractTitle(content, filePath);

    pages.push({
      slug,
      title,
      content_md: content,
      filePath: relative(WIKI_DIR, filePath),
    });
  }

  return pages;
}

/**
 * Fetch all pages from database with their content
 */
async function fetchDbPages(): Promise<DbPage[]> {
  const result = await pool.query(`
    SELECT p.id, p.slug, p.title, p.status,
           COALESCE(
             (SELECT content_md FROM page_revisions WHERE id = p.current_published_revision_id),
             (SELECT content_md FROM page_revisions WHERE id = p.current_draft_revision_id)
           ) as content_md
    FROM pages p
    ORDER BY p.slug
  `);
  return result.rows;
}

/**
 * Import filesystem pages to database
 */
async function importToDb(fsPages: PageData[], dbPages: DbPage[]): Promise<{ inserted: number; updated: number; skipped: number }> {
  const dbSlugs = new Map(dbPages.map(p => [p.slug, p]));
  let inserted = 0, updated = 0, skipped = 0;

  for (const page of fsPages) {
    const existing = dbSlugs.get(page.slug);

    if (existing) {
      // Check if content changed
      if (existing.content_md === page.content_md && existing.title === page.title) {
        console.log(`⏭️  Skip (unchanged): ${page.slug}`);
        skipped++;
        continue;
      }

      // Update existing page
      if (DRY_RUN) {
        console.log(`📝 Would update: ${page.slug}`);
        updated++;
        continue;
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Create new revision
        const revisionId = uuidv4();
        await client.query(
          `INSERT INTO page_revisions (id, page_id, content_md, author_type)
           VALUES ($1, $2, $3, 'human')`,
          [revisionId, existing.id, page.content_md]
        );

        // Update page
        await client.query(
          `UPDATE pages
           SET title = $1,
               current_published_revision_id = $2,
               current_draft_revision_id = NULL,
               status = 'published'
           WHERE id = $3`,
          [page.title, revisionId, existing.id]
        );

        await client.query('COMMIT');
        console.log(`📝 Updated: ${page.slug}`);
        updated++;
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Error updating ${page.slug}:`, err.message);
      } finally {
        client.release();
      }
    } else {
      // Insert new page
      if (DRY_RUN) {
        console.log(`✨ Would insert: ${page.slug}`);
        inserted++;
        continue;
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const pageId = uuidv4();
        const revisionId = uuidv4();

        // Create page
        await client.query(
          `INSERT INTO pages (id, slug, title, status)
           VALUES ($1, $2, $3, 'published')`,
          [pageId, page.slug, page.title]
        );

        // Create revision
        await client.query(
          `INSERT INTO page_revisions (id, page_id, content_md, author_type)
           VALUES ($1, $2, $3, 'human')`,
          [revisionId, pageId, page.content_md]
        );

        // Update page with revision
        await client.query(
          `UPDATE pages SET current_published_revision_id = $1 WHERE id = $2`,
          [revisionId, pageId]
        );

        await client.query('COMMIT');
        console.log(`✨ Inserted: ${page.slug}`);
        inserted++;
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Error inserting ${page.slug}:`, err.message);
      } finally {
        client.release();
      }
    }
  }

  return { inserted, updated, skipped };
}

/**
 * Export database pages to filesystem
 */
async function exportToFs(fsPages: PageData[], dbPages: DbPage[]): Promise<{ exported: number; skipped: number }> {
  const fsSlugs = new Set(fsPages.map(p => p.slug));
  let exported = 0, skipped = 0;

  for (const dbPage of dbPages) {
    // Skip pages that exist in filesystem
    if (fsSlugs.has(dbPage.slug)) {
      skipped++;
      continue;
    }

    // Skip pages without content
    if (!dbPage.content_md) {
      console.log(`⏭️  Skip (no content): ${dbPage.slug}`);
      skipped++;
      continue;
    }

    // Determine file path
    const filePath = slugToPath(dbPage.slug);

    if (DRY_RUN) {
      console.log(`📤 Would export: ${dbPage.slug} → ${relative(WIKI_DIR, filePath)}`);
      exported++;
      continue;
    }

    // Create directory if needed
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Write file
    writeFileSync(filePath, dbPage.content_md, 'utf-8');
    console.log(`📤 Exported: ${dbPage.slug} → ${relative(WIKI_DIR, filePath)}`);
    exported++;
  }

  return { exported, skipped };
}

async function main() {
  console.log('🔄 Bidirectional Wiki ↔ Database Sync\n');
  console.log(`📁 Wiki directory: ${WIKI_DIR}`);
  console.log(`🔗 Database: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@')}`);
  if (DRY_RUN) console.log('🔍 DRY RUN - No changes will be made');
  if (IMPORT_ONLY) console.log('📥 Import only mode');
  if (EXPORT_ONLY) console.log('📤 Export only mode');
  console.log();

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  try {
    // Parse filesystem
    console.log('📖 Reading filesystem...');
    const fsPages = parseMarkdownFiles();
    console.log(`   Found ${fsPages.length} markdown files\n`);

    // Fetch database
    console.log('💾 Fetching database...');
    const dbPages = await fetchDbPages();
    console.log(`   Found ${dbPages.length} pages in database\n`);

    // Import filesystem → database
    if (!EXPORT_ONLY) {
      console.log('📥 Importing filesystem → database:');
      const importResult = await importToDb(fsPages, dbPages);
      console.log(`\n   Inserted: ${importResult.inserted}`);
      console.log(`   Updated:  ${importResult.updated}`);
      console.log(`   Skipped:  ${importResult.skipped}\n`);
    }

    // Export database → filesystem
    if (!IMPORT_ONLY) {
      console.log('📤 Exporting database → filesystem:');
      const exportResult = await exportToFs(fsPages, dbPages);
      console.log(`\n   Exported: ${exportResult.exported}`);
      console.log(`   Skipped:  ${exportResult.skipped}\n`);
    }

  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }

  console.log('✨ Sync complete!');
}

main();
