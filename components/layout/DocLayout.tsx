import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { SectionNavServer } from '../navigation/SectionNavServer'
import { TableOfContents } from '../content/TableOfContents'
import type { SidebarNavItem } from '@/lib/navigation/types'
import type { TOCItem } from '@/lib/mdx/extract-toc'

interface DocLayoutProps {
  children: React.ReactNode
  sidebar?: SidebarNavItem[]
  toc?: TOCItem[]
}

export function DocLayout({ children, sidebar, toc }: DocLayoutProps) {
  const hasSidebar = sidebar && sidebar.length > 0
  const hasToc = toc && toc.length > 0

  // Determine grid columns based on what's present
  let gridCols = 'md:grid-cols-[minmax(0,1fr)]'
  if (hasSidebar && hasToc) {
    gridCols = 'md:grid-cols-[260px_minmax(0,1fr)_200px] lg:grid-cols-[260px_minmax(0,1fr)_240px]'
  } else if (hasSidebar) {
    gridCols = 'md:grid-cols-[260px_minmax(0,1fr)]'
  } else if (hasToc) {
    gridCols = 'md:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_240px]'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SectionNavServer />

      <div className={`container flex-1 items-start md:grid ${gridCols} md:gap-8 lg:gap-12`}>
        {hasSidebar && <Sidebar items={sidebar} />}

        <main className="relative py-6 lg:py-8 w-full">
          {children}
        </main>

        {hasToc && (
          <aside className="hidden md:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 lg:py-8">
            <TableOfContents items={toc} />
          </aside>
        )}
      </div>

      <Footer />
    </div>
  )
}
