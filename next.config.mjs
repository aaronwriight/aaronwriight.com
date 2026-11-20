import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const PHOTO = '/frame-it-wright-photography'
// While true, the photography site is closed to the public: every photography address (on frameitwright.com and
// under /frame-it-wright-photography) is served the under-construction page and nothing else. Set to false to open it.
const PHOTOGRAPHY_UNDER_CONSTRUCTION = true
const CLOSED = `${PHOTO}/under-construction`
const FIW = [{ type: 'host', value: 'frameitwright.com' }]
// The sharing images Next.js serves from the section's own folder (opengraph-image-<hash>.jpg, twitter-image-<hash>.jpg).
// Previews ask for them at /frame-it-wright-photography/..., so neither the prefix redirect nor the under-construction
// lock may touch them: a redirect or a page there leaves Safari, iMessage and social sites with no picture.
const SHARING_IMAGES = '(?:opengraph|twitter)-image'
const AW = [{ type: 'host', value: 'aaronwriight.com' }]
// Top-level paths frameitwright.com serves as they are (not photography pages).
const sharedRoots = ['frame-it-wright-photography', '_next/', 'api/', 'images/', 'brand/', 'files/', 'maps/', 'textures/', 'favicon\\.ico', 'site\\.webmanifest', 'sand_dollar']
// Main-site sections, sent back to aaronwriight.com when asked for on frameitwright.com.
const mainSections = ['cognitive-science', 'creative', 'scope-for-imagination', 'venture', 'literature', 'personal', 'resume', 'stories-and-guides', 'studio']
// Old photography addresses and where they are now.
const photographyMoves = [
  ['/booking', '/contact'],
  ['/mailing-list', '/newsletter'],
  ['/gallery', '/galleries'],
  ['/gallery/graduation', '/portfolio/graduation-seniors'],
  ['/gallery/:slug(wedding|couples-engagement|family-friends-lifestyle)', '/portfolio/:slug'],
  ['/gallery/:slug', '/portfolio'],
]

// The lock is for visitors only: `pnpm dev` and Vercel preview deployments show the photography site as it will be.
// PHOTOGRAPHY_LOCKED is handed to the app (src/data/photography.ts) so the layout and front door agree with it.
export default function nextConfig(phase) {
  const PHOTOGRAPHY_LOCKED = PHOTOGRAPHY_UNDER_CONSTRUCTION && phase !== PHASE_DEVELOPMENT_SERVER && process.env.VERCEL_ENV !== 'preview'

  /** @type {import('next').NextConfig} */
  return {
    env: { PHOTOGRAPHY_LOCKED: String(PHOTOGRAPHY_LOCKED) },
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

        // The mailing lists became newsletters in November 2026.
        { source: '/creative/mailing-list', destination: '/creative/newsletter', permanent: true },
        { source: '/scope-for-imagination/mailing-list', destination: '/scope-for-imagination/newsletter', permanent: true },

        // The stories & guides list was retired in November 2026 (each guide keeps its own page).
        { source: '/stories-and-guides', destination: '/creative', permanent: false },

        // Photography pages that moved in the November 2026 restructure (on every host, before the domain rules).
        ...photographyMoves.map(([from, to]) => ({ source: `${PHOTO}${from}`, destination: `${PHOTO}${to}`, permanent: true })),

        // On frameitwright.com the section lives at the root: links written with the prefix lose it, and the rest of
        // the main site goes back to aaronwriight.com.
        { source: PHOTO, has: FIW, destination: '/', permanent: false },
        { source: `${PHOTO}/:first((?!${SHARING_IMAGES})[^/]+)/:rest*`, has: FIW, destination: '/:first/:rest*', permanent: false },
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
      if (PHOTOGRAPHY_LOCKED) {
        return {
          beforeFiles: [
            { source: '/', has: FIW, destination: CLOSED },
            { source: `/:path((?!${sharedRoots.join('|')}).+)`, has: FIW, destination: CLOSED },
            { source: PHOTO, destination: CLOSED },
            { source: `${PHOTO}/:path((?!under-construction$|${SHARING_IMAGES}).+)`, destination: CLOSED },
          ],
        }
      }
      return {
        beforeFiles: [
          { source: '/', has: FIW, destination: PHOTO },
          { source: `/:path((?!${sharedRoots.join('|')}).+)`, has: FIW, destination: `${PHOTO}/:path` },
        ],
      }
    },
  }
}
