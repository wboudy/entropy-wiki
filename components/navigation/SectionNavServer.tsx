import { SectionNav } from './SectionNav'
import { buildNavTree } from '@/lib/navigation/build-nav-tree'

/**
 * Server component that fetches sections and passes to client SectionNav
 */
export function SectionNavServer() {
  // Get top-level sections from nav tree
  const navTree = buildNavTree()

  // Map to section format (just top-level items)
  const sections = navTree.map((item) => ({
    title: item.title,
    href: item.href,
    items: [],
  }))

  return <SectionNav sections={sections} />
}
