import type { Metadata } from "next";
import Link from "next/link";
import { WikiShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "software & platforms | wiki",
  description: "The tools behind this site's writing, photography, and scientific projects.",
  alternates: { canonical: "/about/platforms" },
};

const platforms = [
  { name: "Next.js, React & Tailwind", role: "The pages, interactive pieces, and shared visual language of the site.", status: "Used by this site", href: "https://nextjs.org" },
  { name: "Sanity", role: "The content studio and media library used by existing CMS-backed content, alongside locally published journal entries.", status: "Integrated in the application", href: "https://www.sanity.io" },
  { name: "Vercel", role: "The site's hosting and deployment platform, and the registrar for aaronwriight.com.", status: "Hosting platform and domain", href: "https://vercel.com" },
  { name: "Resend", role: "Email subscriptions and the Scope for Imagination newsletter. Creative updates have their own list, separate from booking inquiries.", status: "Integrated; each list needs server configuration", href: "https://resend.com" },
  { name: "Cormorant Garamond", role: "The typeface: a free Garamond by Christian Thalmann (SIL Open Font License), standing in for Perpetua. It is served from this site, so pages make no requests to Google.", status: "Self-hosted with next/font", href: "https://fonts.google.com/specimen/Cormorant+Garamond" },
  { name: "AWS Terrain Tiles", role: "Open elevation data (USGS 3DEP, SRTM and others) behind the faint contour map of the Adirondack High Peaks in the site's background.", status: "Generated offline into a small data file", href: "https://registry.opendata.aws/terrain-tiles/" },
  { name: "Pic-Time", role: "Photography gallery hosting and delivery. The photography pages link to my Pic-Time gallery page, where clients can continue to their photographs and sign in.", status: "Gallery-page link; access managed by Pic-Time", href: "https://frameitwrightphotography.pic-time.com/client" },
  { name: "Claude Code & Codex", role: "AI coding assistants used to design and build the site: its pages, the contour background, the design system, and the publishing and mailing-list tools.", status: "Development tools; not part of the running site", href: "https://claude.com/claude-code" },
  { name: "GitHub & local publishing tools", role: "Versioned site code and reviewed public outputs. Python tools prepare journal entries, photography collections, and plot metadata before release.", status: "Repository publishing workflow", href: "https://github.com/aaronwriight/frameitwright" },
  { name: "Quarto, R & the tidyverse", role: "Tools for data visualization in the independent TidyTuesday project. Selected plots can be handed off to this site's cognitive-science section.", status: "Separate source project", href: "https://github.com/aaronwriight/tidytuesday" },
];

export default function PlatformsPage() {
  return <WikiShell title="software & platforms" subtitle="a few of the tools that keep these projects going">
    <p>This site brings together writing, photography, and scientific work. Some tools run the website; others keep the work moving before it reaches a page.</p>
    <div className="not-prose divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
      {platforms.map((platform) => <section key={platform.name} className="grid gap-3 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-8">
        <h2 className="m-0 font-serif text-sm font-medium"><a href={platform.href}>{platform.name}</a></h2>
        <div><p className="m-0 text-sm leading-relaxed">{platform.role}</p><p className="mb-0 mt-2 text-xs text-stone-500">{platform.status}</p></div>
      </section>)}
    </div>
    <p className="text-xs text-stone-500">Maintained from the site and project repositories. A listed integration describes its role; availability depends on its configuration.</p>
    <Link href="/about">← back to the wiki</Link>
  </WikiShell>;
}
