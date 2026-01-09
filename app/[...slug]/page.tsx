import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { DocLayout } from '@/components/layout/DocLayout'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getDocBySlug, docExists } from '@/lib/mdx/get-doc-by-slug'
import { getAllDocs } from '@/lib/mdx/get-all-docs'
import { buildSectionNavTree } from '@/lib/navigation/build-nav-tree'

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

/**
 * Generate static params for all documentation pages
 */
export async function generateStaticParams() {
  const docs = getAllDocs()

  return docs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
}

/**
 * Generate metadata for each page
 */
export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: doc.frontMatter.title,
    description: doc.frontMatter.description,
  }
}

/**
 * Documentation page component
 */
export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params

  // Check if doc exists
  if (!docExists(slug)) {
    notFound()
  }

  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  // Get the section (first segment of slug) for sidebar
  const section = slug[0]
  const sidebarNav = buildSectionNavTree(section)

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
          {doc.content}
        </ReactMarkdown>
      </article>
    </DocLayout>
  )
}
