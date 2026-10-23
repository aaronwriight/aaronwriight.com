import Link from "next/link";
import type { Metadata } from "next";
import { WikiShell } from "@/components/site/site-content";
export const metadata: Metadata = {
  title: "wiki", /* top left corner */
  description: "an ode to slow living",
  openGraph: {
    title: "aaron wright",
    description: "an ode to slow living",
    images: ["/sand_dollar.png"],
    authors: ["https://aaronwriight.github.io"],
  },
};

export default function AboutPage() {
  return (
    <WikiShell title="wiki">
      <div>
        <h2 className="m-0  text-sm  font-medium antialiased"><b>bio</b></h2>
        <p className="m-0 mt-2 text-sm  antialiased">
          A creative endeavor by <Link href="https://aaronwriight.github.io">Aaron Wright</Link>.
        </p>
      </div>
      <div>
        <h2 className="m-0  text-sm  font-medium antialiased"><b>nav</b></h2>
        <p className="m-0 mt-2 text-sm antialiased">
          This site gathers a few threads of my life, from cognitive science, mentorship, creative interests, writing, and photography, to all the
          little things that broaden my scope for imagination. I hope you enjoy :)
        </p>
      </div>
      <div>
        <h2 className="m-0  text-sm  font-medium antialiased"><b>dev</b></h2>
        <p className="m-0 mt-2 text-sm  antialiased">
          Written in React via <Link href="https://nextjs.org">Next.js</Link>, with{" "}
          <Link href="https://sanity.io">Sanity</Link> as the CMS and a few homemade tools for publishing the journal.
          Styled with <Link href="https://tailwindcss.com">Tailwind</Link> and set in{" "}
          <Link href="https://fonts.google.com/specimen/Cormorant+Garamond">Cormorant Garamond</Link>. The faint contour
          map behind every page is the Adirondack High Peaks, drawn from open elevation data. Newsletters go out through{" "}
          <Link href="https://resend.com">Resend</Link>, and the site is hosted on <Link href="https://vercel.com">Vercel</Link>.
        </p>
        <p className="m-0 mt-2 text-sm antialiased">
          Designed and built with the help of AI coding assistants, <Link href="https://claude.com/claude-code">Claude Code</Link>{" "}
          and <Link href="https://openai.com/codex">Codex</Link>.
        </p>
        <p className="m-0 mt-2 text-sm antialiasted">
          Forked from <Link href="https://github.com/tbrasington/the-post-chaise-site">Thomas Brasington</Link> on GitHub.
        </p>
        <p className="m-0 mt-3 text-sm">
          <Link href="/about/platforms">Software & platforms →</Link>, including the tools behind writing, photography, and scientific projects.
        </p>
      </div>
    </WikiShell>
  );
}
