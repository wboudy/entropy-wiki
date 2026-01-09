import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'
import type { SidebarNavItem } from '@/lib/navigation/types'
import type { TableOfContents as TOC } from '@/lib/mdx/types'

interface DocLayoutProps {
  children: React.ReactNode
  sidebar?: SidebarNavItem[]
  toc?: TOC
}

export function DocLayout({ children, sidebar, toc }: DocLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {sidebar && sidebar.length > 0 && <Sidebar items={sidebar} />}

        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </div>

          {toc && toc.items.length > 0 && (
            <div className="hidden text-sm xl:block">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
                <TableOfContents toc={toc} />
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
