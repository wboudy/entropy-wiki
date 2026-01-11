'use client'

import { createContext, useContext, useMemo } from 'react'
import type { SidebarNavItem } from './types'
import { findNodeByPath, getSiblings, getAncestors } from './nav-utils'

interface NavContextValue {
  navTree: SidebarNavItem[]
  currentPath: string
  siblings: SidebarNavItem[]
  ancestors: SidebarNavItem[]
  currentNode: SidebarNavItem | null
}

const NavContext = createContext<NavContextValue | null>(null)

interface NavProviderProps {
  children: React.ReactNode
  navTree: SidebarNavItem[]
  currentPath: string
}

export function NavProvider({ children, navTree, currentPath }: NavProviderProps) {
  const value = useMemo(() => {
    const currentNode = findNodeByPath(navTree, currentPath)
    const siblings = getSiblings(navTree, currentPath)
    const ancestors = getAncestors(navTree, currentPath)

    return {
      navTree,
      currentPath,
      siblings,
      ancestors,
      currentNode,
    }
  }, [navTree, currentPath])

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNavContext(): NavContextValue {
  const context = useContext(NavContext)

  if (!context) {
    throw new Error('useNavContext must be used within a NavProvider')
  }

  return context
}

export { NavContext }
