import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { getDocBySlug } from '@/lib/mdx/get-doc-by-slug'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SectionNavServer } from '@/components/navigation/SectionNavServer'

export const metadata = {
  title: 'Entropy Wiki',
  description: 'Cyber-utilitarian monorepo for AI skills, prompts, and MCP toolsets',
  openGraph: {
    title: 'Entropy Wiki',
    description: 'Cyber-utilitarian monorepo for AI skills, prompts, and MCP toolsets',
    url: 'https://entropy-wiki.vercel.app',
    siteName: 'Entropy Wiki',
    type: 'website',
    locale: 'en_US',
  },
}

const sections = [
  {
    title: 'Beads',
    description: 'Git-backed issue tracking with dependencies and persistent memory',
    href: '/beads',
  },
  {
    title: 'Gastown',
    description: 'Agent orchestration and multi-agent workflows',
    href: '/gastown',
  },
  {
    title: 'Orchestration',
    description: 'Task coordination and execution patterns',
    href: '/orchestration',
  },
  {
    title: 'Plugins',
    description: 'Claude Code plugin development',
    href: '/plugins',
  },
  {
    title: 'Prompt Bank',
    description: 'Reusable prompt templates and patterns',
    href: '/prompt-bank',
  },
  {
    title: 'Skills Bank',
    description: 'Skill definitions for Claude Code',
    href: '/skills-bank',
  },
  {
    title: 'Tooling MCP',
    description: 'Model Context Protocol server development',
    href: '/tooling-mcp',
  },
]

export default async function HomePage() {
  // Try to load wiki/home.md if it exists
  const homeDoc = await getDocBySlug(['home'])

  const content = homeDoc ? (
    <>
      <h1 className="mb-2">{homeDoc.frontMatter.title}</h1>
      {homeDoc.frontMatter.description && (
        <p className="text-xl text-muted-foreground mb-8">
          {homeDoc.frontMatter.description}
        </p>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {homeDoc.content.replace(/^#\s+.+$/m, '').trim()}
      </ReactMarkdown>
    </>
  ) : (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Entropy Wiki</h1>
        <p className="text-xl text-muted-foreground">
          Cyber-utilitarian monorepo for AI skills, prompts, and MCP toolsets
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-muted-foreground">{section.description}</p>
          </Link>
        ))}
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <SectionNavServer />

      <div className="container flex-1">
        <main className="relative py-6 lg:py-8 max-w-4xl mx-auto">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            {content}
          </article>
        </main>
      </div>

      <Footer />
    </div>
  )
}
