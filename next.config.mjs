/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
      },
    ],
  },
  experimental: {
    taint: true,
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  webpack(config, { dev }) {
    // Vercel restores `.next/cache` before every build. This site's production
    // webpack cache exceeds 1 GB while its deployable output is about 50 MB, so
    // keep remote production builds bounded by caching only in development.
    if (!dev) {
      config.cache = false
    }

    return config
  },
  // www and the old vercel.app address both go to the canonical https://aaronwriight.com (exact hosts only, so
  // preview deployments are untouched).
  async redirects() {
    return ['www.aaronwriight.com', 'aaronwriight.vercel.app'].map((host) => ({
      source: '/:path*',
      has: [{ type: 'host', value: host }],
      destination: 'https://aaronwriight.com/:path*',
      permanent: true,
    }))
  },
}

export default nextConfig
