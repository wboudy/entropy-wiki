import { MobileNav } from './MobileNav'
import { buildNavTree } from '@/lib/navigation/build-nav-tree'

/**
 * Server component that fetches sections and passes to client MobileNav
 */
export function MobileNavServer() {
  // Get top-level sections from nav tree
  const navTree = buildNavTree()

  // Map to section format (just top-level items with valid hrefs)
  const sections = navTree
    .filter((item) => item.href) // Only include items with hrefs
    .map((item) => ({
      title: item.title,
      href: item.href as string, // Safe assertion since we filtered
    }))

  return <MobileNav sections={sections} />
}
