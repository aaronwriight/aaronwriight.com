const PHOTO = '/frame-it-wright-photography'
const FIW = [{ type: 'host', value: 'frameitwright.com' }]
const AW = [{ type: 'host', value: 'aaronwriight.com' }]
// Top-level paths frameitwright.com serves as they are (not photography pages).
const sharedRoots = ['frame-it-wright-photography', '_next/', 'api/', 'images/', 'brand/', 'files/', 'maps/', 'textures/', 'favicon\\.ico', 'site\\.webmanifest', 'sand_dollar']
// Main-site sections, sent back to aaronwriight.com when asked for on frameitwright.com.
const mainSections = ['cognitive-science', 'creative', 'scope-for-imagination', 'venture', 'literature', 'personal', 'resume', 'stories-and-guides', 'studio']
// Old photography addresses and where they are now.
const photographyMoves = [
  ['/booking', '/contact'],
  ['/gallery', '/galleries'],
  ['/gallery/graduation', '/portfolio/graduation-seniors'],
  ['/gallery/:slug(wedding|couples-engagement|family-friends-lifestyle)', '/portfolio/:slug'],
  ['/gallery/:slug', '/portfolio'],
]

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
  // preview deployments are untouched). frameitwright.com is the photography section's own address: see below.
  async redirects() {
    return [
      ...['www.aaronwriight.com', 'aaronwriight.vercel.app'].map((host) => ({
        source: '/:path*',
        has: [{ type: 'host', value: host }],
        destination: 'https://aaronwriight.com/:path*',
        permanent: true,
      })),
      { source: '/:path*', has: [{ type: 'host', value: 'www.frameitwright.com' }], destination: 'https://frameitwright.com/:path*', permanent: true },

      // The stories & guides list was retired in November 2026 (each guide keeps its own page).
      { source: '/stories-and-guides', destination: '/creative', permanent: false },

      // Photography pages that moved in the November 2026 restructure (on every host, before the domain rules).
      ...photographyMoves.map(([from, to]) => ({ source: `${PHOTO}${from}`, destination: `${PHOTO}${to}`, permanent: true })),

      // On frameitwright.com the section lives at the root: links written with the prefix lose it, and the rest of
      // the main site goes back to aaronwriight.com.
      { source: PHOTO, has: FIW, destination: '/', permanent: false },
      { source: `${PHOTO}/:path*`, has: FIW, destination: '/:path*', permanent: false },
      ...mainSections.map((section) => ({ source: `/${section}/:path*`, has: FIW, destination: `https://aaronwriight.com/${section}/:path*`, permanent: false })),

      // On aaronwriight.com the section has moved to frameitwright.com. Temporary until the new address has settled.
      { source: PHOTO, has: AW, destination: 'https://frameitwright.com/', permanent: false },
      { source: `${PHOTO}/:path*`, has: AW, destination: 'https://frameitwright.com/:path*', permanent: false },
    ]
  },
  // frameitwright.com serves the photography section from its root: /portfolio is /frame-it-wright-photography/portfolio,
  // and / is the photography home, not the front door. Checked before the app's own routes. Rewrites chain, so the
  // second rule must not match the first one's result (the prefix itself is excluded), and shared files (the build's
  // assets, images, brand files) are left alone.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', has: FIW, destination: PHOTO },
        { source: `/:path((?!${sharedRoots.join('|')}).+)`, has: FIW, destination: `${PHOTO}/:path` },
      ],
    }
  },
}

export default nextConfig
