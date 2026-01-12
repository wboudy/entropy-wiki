import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { DocLayout } from '@/components/layout/DocLayout'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildSectionNavTree } from '@/lib/navigation/build-nav-tree'
import { fetchPageFromApi, pageToMDXDocument } from '@/lib/api/server'
import type { MDXDocument } from '@/lib/mdx/types'

// Dynamic rendering with ISR caching
// Pages are fetched from the database API and cached for 60 seconds
// No static generation - pages are rendered on-demand
export const revalidate = 60
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

/**
 * Get document from database via API (database-first)
 * No filesystem fallback - shows error page if unavailable
 */
async function getDocument(slug: string[]): Promise<MDXDocument | null> {
  const slugStr = slug.join('/')
  const page = await fetchPageFromApi(slugStr)

  if (!page) {
    return null
  }

  return pageToMDXDocument(page, slug)
}

// No generateStaticParams - pages are rendered dynamically from database
// This enables full database-first content management

/**
 * Generate metadata for each page
 */
export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params
  const doc = await getDocument(slug)

  if (!doc) {
    return {
      title: 'Not Found',
    }
  }

  const title = doc.frontMatter.title
  const description = doc.frontMatter.description || 'Entropy Wiki - Cyber-utilitarian monorepo for AI skills, prompts, and MCP toolsets'
  const url = `https://entropy-wiki.vercel.app/${slug.join('/')}`

  return {
    title: `${title} | Entropy Wiki`,
    description,
    openGraph: {
      title: `${title} | Entropy Wiki`,
      description,
      url,
      siteName: 'Entropy Wiki',
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Entropy Wiki`,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Documentation page component
 * Fetches content from database via API (database-first, no filesystem fallback)
 */
export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params

  // Fetch document from database via API
  const doc = await getDocument(slug)

  if (!doc) {
    notFound()
  }

  // Get the section (first segment of slug) for sidebar
  const section = slug[0]
  const sidebarNav = buildSectionNavTree(section)

  // Remove the first h1 from content since we already extract it as title
  const contentWithoutTitle = doc.content.replace(/^#\s+.+$/m, '').trim()

  return (
    <DocLayout sidebar={sidebarNav}>
      <Breadcrumb slug={slug} />

      <article className="prose prose-slate dark:prose-invert max-w-none mt-2">
        <h1 className="mb-2">{doc.frontMatter.title}</h1>
        {doc.frontMatter.description && (
          <p className="text-xl text-muted-foreground mb-8">
            {doc.frontMatter.description}
          </p>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {contentWithoutTitle}
        </ReactMarkdown>
      </article>
    </DocLayout>
  )
}
