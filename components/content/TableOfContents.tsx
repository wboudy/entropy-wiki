'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { TOCItem } from '@/lib/mdx/extract-toc'

interface TableOfContentsProps {
  items: TOCItem[]
  className?: string
}

/**
 * Table of contents component - sticky sidebar on desktop, inline on mobile
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <nav className={cn('space-y-2', className)} aria-label="Table of contents">
      <h2 className="font-semibold text-sm text-foreground mb-3">On this page</h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(item.level === 3 && 'ml-4')}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                'block py-1 text-muted-foreground hover:text-foreground transition-colors',
                activeId === item.id && 'text-foreground font-medium'
              )}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(item.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                  // Update URL hash without jumping
                  window.history.pushState(null, '', `#${item.id}`)
                  setActiveId(item.id)
                }
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Wrapper for server-side TOC extraction
 */
interface TableOfContentsServerProps {
  content: string
  className?: string
}

export function TableOfContentsWrapper({ items, className }: TableOfContentsProps) {
  return <TableOfContents items={items} className={className} />
}
