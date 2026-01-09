import type { TableOfContents, TableOfContentsItem } from './types'

/**
 * Extract table of contents from markdown content
 * Parses headings (##, ###, etc.) and generates TOC structure
 */
export function parseTableOfContents(content: string): TableOfContents {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm
  const items: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length // Number of # symbols
    const title = match[2].trim()

    // Generate ID from title (lowercase, replace spaces with hyphens, remove special chars)
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    items.push({
      id,
      title,
      level,
    })
  }

  return { items }
}

/**
 * Convert TOC items to nested structure
 * Useful for rendering hierarchical navigation
 */
export interface NestedTOCItem extends TableOfContentsItem {
  children?: NestedTOCItem[]
}

export function nestTableOfContents(items: TableOfContentsItem[]): NestedTOCItem[] {
  if (items.length === 0) return []

  const nested: NestedTOCItem[] = []
  const stack: NestedTOCItem[] = []

  for (const item of items) {
    const node: NestedTOCItem = { ...item, children: [] }

    // Find the appropriate parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      nested.push(node)
    } else {
      const parent = stack[stack.length - 1]
      parent.children = parent.children || []
      parent.children.push(node)
    }

    stack.push(node)
  }

  return nested
}

/**
 * Get only H2 headings (common for page-level TOC)
 */
export function getH2Headings(content: string): TableOfContentsItem[] {
  const toc = parseTableOfContents(content)
  return toc.items.filter(item => item.level === 2)
}

/**
 * Get headings up to a certain level
 */
export function getHeadingsUpToLevel(content: string, maxLevel: number): TableOfContentsItem[] {
  const toc = parseTableOfContents(content)
  return toc.items.filter(item => item.level <= maxLevel)
}
