export interface TOCItem {
  id: string
  title: string
  level: number
}

/**
 * Extract table of contents from markdown content
 * Parses ## and ### headings
 */
export function extractTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const items: TOCItem[] = []

  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = slugify(title)

    items.push({
      id,
      title,
      level,
    })
  }

  return items
}

/**
 * Convert a heading to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim()
}

/**
 * Get nested TOC structure (h2 with nested h3s)
 */
export interface NestedTOCItem extends TOCItem {
  children: TOCItem[]
}

export function extractNestedTOC(content: string): NestedTOCItem[] {
  const flatItems = extractTOC(content)
  const nested: NestedTOCItem[] = []
  let currentH2: NestedTOCItem | null = null

  for (const item of flatItems) {
    if (item.level === 2) {
      currentH2 = { ...item, children: [] }
      nested.push(currentH2)
    } else if (item.level === 3 && currentH2) {
      currentH2.children.push(item)
    } else if (item.level === 3 && !currentH2) {
      // h3 without parent h2, add as top level
      nested.push({ ...item, children: [] })
    }
  }

  return nested
}
