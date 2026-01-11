import type { SidebarNavItem } from './types'

/**
 * Find a node in the navigation tree by its path/href
 */
export function findNodeByPath(
  items: SidebarNavItem[],
  path: string
): SidebarNavItem | null {
  const normalizedPath = normalizePath(path)

  for (const item of items) {
    if (item.href && normalizePath(item.href) === normalizedPath) {
      return item
    }

    if (item.items && item.items.length > 0) {
      const found = findNodeByPath(item.items, path)
      if (found) return found
    }
  }

  return null
}

/**
 * Get sibling nodes (nodes at the same level)
 */
export function getSiblings(
  items: SidebarNavItem[],
  path: string
): SidebarNavItem[] {
  const normalizedPath = normalizePath(path)

  // Check if it's at the root level
  for (const item of items) {
    if (item.href && normalizePath(item.href) === normalizedPath) {
      return items
    }
  }

  // Search in children
  for (const item of items) {
    if (item.items && item.items.length > 0) {
      const siblings = getSiblingsRecursive(item.items, normalizedPath)
      if (siblings) return siblings
    }
  }

  return []
}

function getSiblingsRecursive(
  items: SidebarNavItem[],
  path: string
): SidebarNavItem[] | null {
  for (const item of items) {
    if (item.href && normalizePath(item.href) === path) {
      return items
    }
  }

  for (const item of items) {
    if (item.items && item.items.length > 0) {
      const found = getSiblingsRecursive(item.items, path)
      if (found) return found
    }
  }

  return null
}

/**
 * Get ancestor nodes (parent chain from root to current)
 */
export function getAncestors(
  items: SidebarNavItem[],
  path: string
): SidebarNavItem[] {
  const normalizedPath = normalizePath(path)
  const ancestors: SidebarNavItem[] = []

  function findWithAncestors(
    nodes: SidebarNavItem[],
    currentPath: SidebarNavItem[]
  ): boolean {
    for (const node of nodes) {
      if (node.href && normalizePath(node.href) === normalizedPath) {
        ancestors.push(...currentPath)
        return true
      }

      if (node.items && node.items.length > 0) {
        if (findWithAncestors(node.items, [...currentPath, node])) {
          return true
        }
      }
    }
    return false
  }

  findWithAncestors(items, [])
  return ancestors
}

/**
 * Get breadcrumb chain including the current node
 */
export function getBreadcrumbChain(
  items: SidebarNavItem[],
  path: string
): SidebarNavItem[] {
  const ancestors = getAncestors(items, path)
  const current = findNodeByPath(items, path)

  if (current) {
    return [...ancestors, current]
  }

  return ancestors
}

/**
 * Get previous and next nodes in tree order (depth-first)
 */
export function getPrevNext(
  items: SidebarNavItem[],
  path: string
): { prev: SidebarNavItem | null; next: SidebarNavItem | null } {
  const flatList = flattenTree(items)
  const normalizedPath = normalizePath(path)

  const currentIndex = flatList.findIndex(
    (item) => item.href && normalizePath(item.href) === normalizedPath
  )

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? flatList[currentIndex - 1] : null,
    next: currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null,
  }
}

/**
 * Flatten tree to array in depth-first order (only items with hrefs)
 */
export function flattenTree(items: SidebarNavItem[]): SidebarNavItem[] {
  const result: SidebarNavItem[] = []

  for (const item of items) {
    if (item.href) {
      result.push(item)
    }

    if (item.items && item.items.length > 0) {
      result.push(...flattenTree(item.items))
    }
  }

  return result
}

/**
 * Normalize a path for comparison (remove trailing slashes, ensure leading slash)
 */
function normalizePath(path: string): string {
  let normalized = path.trim()
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized
  }
  if (normalized.endsWith('/') && normalized.length > 1) {
    normalized = normalized.slice(0, -1)
  }
  return normalized.toLowerCase()
}
