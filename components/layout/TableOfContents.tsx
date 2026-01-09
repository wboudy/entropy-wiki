"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { TableOfContents as TOC } from '@/lib/mdx/types'

interface TableOfContentsProps {
  toc: TOC
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    const headings = document.querySelectorAll('h2, h3, h4')
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [])

  if (!toc.items || toc.items.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-semibold">On This Page</p>
      <ul className="space-y-2 text-sm">
        {toc.items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "border-l-2 border-transparent pl-4",
              item.level === 3 && "ml-4",
              item.level === 4 && "ml-8",
              activeId === item.id && "border-primary font-medium text-primary"
            )}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "hover:text-foreground transition-colors",
                activeId === item.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
