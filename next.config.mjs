/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/beads',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
