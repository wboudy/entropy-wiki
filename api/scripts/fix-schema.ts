import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function fixSchema() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('Connecting to:', dbUrl?.replace(/:[^:@]+@/, ':****@'));

  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    // Check existing columns
    const columnsResult = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'pages' ORDER BY ordinal_position"
    );
    const existingColumns = columnsResult.rows.map(r => r.column_name);
    console.log('Existing columns:', existingColumns.join(', '));

    // Check if parent_id exists
    if (!existingColumns.includes('parent_id')) {
      console.log('\nparent_id MISSING - running migration...');

      // Read and run the hierarchy migration
      const migrationPath = join(import.meta.dirname, '../src/db/migrations/002_hierarchy.sql');
      console.log('Reading migration from:', migrationPath);
      const sql = readFileSync(migrationPath, 'utf-8');

      // Run migration
      await pool.query(sql);
      console.log('Migration applied!');

      // Verify
      const verifyResult = await pool.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'pages' ORDER BY ordinal_position"
      );
      console.log('Columns after migration:', verifyResult.rows.map(r => r.column_name).join(', '));
    } else {
      console.log('\nparent_id EXISTS - checking other hierarchy columns...');

      // Check for sort_order and effective_visibility
      if (!existingColumns.includes('sort_order')) {
        console.log('Adding sort_order column...');
        await pool.query('ALTER TABLE pages ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0');
      }
      if (!existingColumns.includes('effective_visibility')) {
        console.log('Adding effective_visibility column...');
        await pool.query("ALTER TABLE pages ADD COLUMN IF NOT EXISTS effective_visibility VARCHAR(20) DEFAULT 'public'");
      }

      console.log('All columns present!');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

fixSchema();
