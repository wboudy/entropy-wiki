import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SidebarNavItem } from '@/lib/navigation/types'
import { getPrevNext } from '@/lib/navigation/nav-utils'

interface PrevNextNavProps {
  navTree: SidebarNavItem[]
  currentPath: string
  className?: string
}

/**
 * Navigation component showing previous/next pages based on nav tree order
 */
export function PrevNextNav({ navTree, currentPath, className }: PrevNextNavProps) {
  const { prev, next } = getPrevNext(navTree, currentPath)

  if (!prev && !next) {
    return null
  }

  return (
    <nav
      className={`flex items-center justify-between gap-4 py-8 border-t border-border ${className || ''}`}
      aria-label="Page navigation"
    >
      {prev && prev.href ? (
        <Link
          href={prev.href}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group max-w-[45%]"
        >
          <ChevronLeft className="h-4 w-4 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          <div className="text-left min-w-0">
            <div className="text-xs uppercase tracking-wide">Previous</div>
            <div className="font-medium truncate">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next && next.href ? (
        <Link
          href={next.href}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group max-w-[45%] ml-auto"
        >
          <div className="text-right min-w-0">
            <div className="text-xs uppercase tracking-wide">Next</div>
            <div className="font-medium truncate">{next.title}</div>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
