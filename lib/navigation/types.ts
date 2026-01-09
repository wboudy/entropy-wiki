export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface DocMetadata {
  title: string
  description?: string
  [key: string]: any
}

export interface NavigationData {
  [key: string]: string | NavigationData
}
