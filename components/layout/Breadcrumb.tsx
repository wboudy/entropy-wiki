'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import type { SidebarNavItem } from '@/lib/navigation/types'
import { getSiblings } from '@/lib/navigation/nav-utils'
import { cn } from '@/lib/utils/cn'

interface BreadcrumbProps {
  slug: string[]
  navTree?: SidebarNavItem[]
}

interface BreadcrumbSegment {
  href: string
  label: string
  siblings: SidebarNavItem[]
}

export function Breadcrumb({ slug, navTree = [] }: BreadcrumbProps) {
  const segments: BreadcrumbSegment[] = slug.map((segment, index) => {
    const href = '/' + slug.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Get siblings at this level for dropdown
    const siblings = navTree.length > 0 ? getSiblings(navTree, href) : []

    return { href, label, siblings }
  })

  return (
    <NavigationMenu.Root className="relative z-10 mb-4">
      <NavigationMenu.List className="flex items-center space-x-1 text-sm text-muted-foreground">
        {/* Home link */}
        <NavigationMenu.Item>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </NavigationMenu.Item>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const hasSiblings = segment.siblings.length > 1

          return (
            <NavigationMenu.Item key={segment.href} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />

              {isLast ? (
                // Last segment - no dropdown, just text
                <span className="text-foreground font-medium">{segment.label}</span>
              ) : hasSiblings ? (
                // Segment with siblings - show dropdown on hover
                <>
                  <NavigationMenu.Trigger className="group flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                    <Link href={segment.href} className="hover:text-foreground">
                      {segment.label}
                    </Link>
                    <ChevronRight className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content className="absolute top-full left-0 mt-1 w-auto">
                    <div className="rounded-md border bg-popover p-2 shadow-md min-w-[180px]">
                      <ul className="space-y-1">
                        {segment.siblings.map((sibling) => (
                          <li key={sibling.href}>
                            <NavigationMenu.Link asChild>
                              <Link
                                href={sibling.href || '#'}
                                className={cn(
                                  'block px-3 py-2 rounded-md text-sm transition-colors',
                                  sibling.href === segment.href
                                    ? 'bg-accent text-accent-foreground font-medium'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                                )}
                              >
                                {sibling.title}
                              </Link>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenu.Content>
                </>
              ) : (
                // Segment without siblings - just a link
                <Link href={segment.href} className="hover:text-foreground transition-colors">
                  {segment.label}
                </Link>
              )}
            </NavigationMenu.Item>
          )
        })}
      </NavigationMenu.List>

      <NavigationMenu.Viewport className="absolute top-full left-0 w-full" />
    </NavigationMenu.Root>
  )
}
