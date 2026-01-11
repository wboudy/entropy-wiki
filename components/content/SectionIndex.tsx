import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface PageInfo {
  title: string
  description?: string
  href: string
}

interface SectionIndexProps {
  section: string
  className?: string
}

/**
 * Auto-generates a list of all pages in a section with titles and descriptions
 */
export async function SectionIndex({ section, className }: SectionIndexProps) {
  const pages = await getSectionPages(section)

  if (pages.length === 0) {
    return (
      <p className="text-muted-foreground">No pages found in this section.</p>
    )
  }

  return (
    <div className={className}>
      <ul className="space-y-4 list-none pl-0">
        {pages.map((page) => (
          <li key={page.href} className="border-b border-border pb-4 last:border-0">
            <Link
              href={page.href}
              className="block hover:bg-accent rounded-md p-2 -m-2 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-1">{page.title}</h3>
              {page.description && (
                <p className="text-muted-foreground text-sm">{page.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Get all pages in a section from the wiki directory
 */
async function getSectionPages(section: string): Promise<PageInfo[]> {
  const wikiDir = path.join(process.cwd(), 'wiki', section)
  const pages: PageInfo[] = []

  if (!fs.existsSync(wikiDir)) {
    return pages
  }

  const entries = fs.readdirSync(wikiDir, { withFileTypes: true })

  for (const entry of entries) {
    // Skip hidden files and _meta.json
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) {
      continue
    }

    // Handle markdown files
    if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      // Skip README as it's the section index itself
      if (entry.name.toLowerCase() === 'readme.md') {
        continue
      }

      const filePath = path.join(wikiDir, entry.name)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(content)

      const slug = entry.name.replace(/\.(md|mdx)$/, '')
      pages.push({
        title: data.title || formatTitle(slug),
        description: data.description,
        href: `/${section}/${slug}`,
      })
    }

    // Handle subdirectories (check for README.md)
    if (entry.isDirectory()) {
      const readmePath = path.join(wikiDir, entry.name, 'README.md')

      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf-8')
        const { data } = matter(content)

        pages.push({
          title: data.title || formatTitle(entry.name),
          description: data.description,
          href: `/${section}/${entry.name}`,
        })
      } else {
        // Directory without README
        pages.push({
          title: formatTitle(entry.name),
          href: `/${section}/${entry.name}`,
        })
      }
    }
  }

  // Sort alphabetically by title
  return pages.sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Convert slug to title format
 */
function formatTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}
