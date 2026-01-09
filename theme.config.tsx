import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>⚡ Entropy Wiki</span>,
  project: {
    link: 'https://github.com/wboudy/entropy-wiki',
  },
  docsRepositoryBase: 'https://github.com/wboudy/entropy-wiki/tree/master',
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} © Entropy Wiki - Cyber-utilitarian monorepo for AI capabilities
      </span>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Entropy Wiki'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Entropy Wiki" />
      <meta property="og:description" content="Cyber-utilitarian monorepo for AI skills, prompts, and MCP toolsets" />
    </>
  ),
  primaryHue: 220,
  primarySaturation: 80,
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
    float: true,
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  navigation: {
    prev: true,
    next: true
  },
  gitTimestamp: ({ timestamp }) => (
    <>Last updated on {timestamp.toLocaleDateString()}</>
  ),
}

export default config
