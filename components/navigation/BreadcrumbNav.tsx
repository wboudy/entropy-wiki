import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildNavTree } from '@/lib/navigation/build-nav-tree'

interface BreadcrumbNavProps {
  slug: string[]
}

/**
 * Server component wrapper that fetches nav tree and passes to client Breadcrumb
 */
export function BreadcrumbNav({ slug }: BreadcrumbNavProps) {
  // Build the full nav tree on the server
  const navTree = buildNavTree()

  return <Breadcrumb slug={slug} navTree={navTree} />
}
