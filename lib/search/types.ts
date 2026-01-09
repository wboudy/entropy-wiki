export interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  category?: string
  breadcrumbs?: string[]
}

export interface SearchIndex {
  id: string
  title: string
  content: string
  url: string
  category?: string
}

export interface SearchOptions {
  limit?: number
  threshold?: number
  includeMatches?: boolean
}

export interface SearchResultWithScore extends SearchResult {
  score: number
}
