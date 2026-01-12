import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force cache purge on rebuild
  reactStrictMode: true,
  async redirects() {
    return [
      // Handle legacy .md extension URLs
      {
        source: '/:path*.md',
        destination: '/:path*',
        permanent: true,
      },
      // Handle README.md URLs -> parent directory
      {
        source: '/:path*/README',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
