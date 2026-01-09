import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import type { SerializedMDX } from './types'
import { mdxOptions } from './mdx-plugins'

const DOCS_DIR = path.join(process.cwd(), 'docs')

/**
 * Convert slug to file path
 * Examples:
 *   "beads" -> docs/beads/README.md
 *   "beads/lifecycle" -> docs/beads/lifecycle.md
 */
function slugToFilePath(slug: string[]): string | null {
  const possiblePaths = [
    // Try exact path with .md
    path.join(DOCS_DIR, ...slug) + '.md',
    // Try exact path with .mdx
    path.join(DOCS_DIR, ...slug) + '.mdx',
    // Try as directory with README.md
    path.join(DOCS_DIR, ...slug, 'README.md'),
    // Try as directory with README.mdx
    path.join(DOCS_DIR, ...slug, 'README.mdx'),
  ]

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

/**
 * Get a document by its slug and serialize it for rendering
 */
export async function getDocBySlug(slug: string[]): Promise<SerializedMDX | null> {
  try {
    const filePath = slugToFilePath(slug)

    if (!filePath) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const mdxSource = await serialize(content, {
      mdxOptions,
      parseFrontmatter: false,
    })

    const frontMatter = {
      title: data.title || slug[slug.length - 1],
      description: data.description,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      draft: data.draft || false,
      ...data,
    }

    return {
      mdxSource,
      frontMatter,
      slug: slug.join('/'),
    }
  } catch (error) {
    console.error(`Error getting doc for slug ${slug.join('/')}:`, error)
    return null
  }
}

/**
 * Check if a document exists for a given slug
 */
export function docExists(slug: string[]): boolean {
  return slugToFilePath(slug) !== null
}

/**
 * Get the file path for a slug (for reading file system directly)
 */
export function getDocFilePath(slug: string[]): string | null {
  return slugToFilePath(slug)
}
