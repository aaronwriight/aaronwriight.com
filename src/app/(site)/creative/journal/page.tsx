import type { Metadata } from "next";
import Link from "next/link";
import { SfiPostHeader } from "@/components/site/sfi-post-header";
import { CreativeShell } from "@/components/site/site-content";
import { getAllSfiPosts } from "@/lib/sfi-posts";
import { getAllVentureEntries } from "@/lib/venture-entries";

export const metadata: Metadata = {
  title: "journal | creative",
  description: "Every entry from Scope for Imagination and Venture, newest first.",
  alternates: { canonical: "/creative/journal" },
};

// The journal: both journals' entries in one list, newest first, each marked with its journal and linking to its
// own page. Each journal keeps its own about page and index, linked at the top.
export default async function CreativeJournalPage() {
  const [sfi, venture] = await Promise.all([getAllSfiPosts(), getAllVentureEntries()]);
  const entries = [
    ...sfi.map((post) => ({ post, journal: "scope for imagination", href: `/scope-for-imagination/${post.entry}`, key: `sfi:${post.entry}` })),
    ...venture.map((post) => ({ post, journal: "venture", href: `/venture/${post.slug}`, key: `venture:${post.slug}` })),
  ].sort((a, b) => `${b.post.date} ${b.post.time}`.localeCompare(`${a.post.date} ${a.post.time}`));

  return (
    <CreativeShell title="journal">
      <p>
        Two journals, one list: <Link href="/scope-for-imagination">scope for imagination</Link> for photographs, reflections, and
        life updates, and <Link href="/venture">venture</Link>, a field journal for peaks, parks, and places worth remembering.
      </p>
      <div className="not-prose mt-8 border-t border-stone-300 dark:border-stone-700">
        {entries.length === 0 && <p className="py-6 font-serif text-sm italic text-stone-500">No entries yet.</p>}
        {entries.map(({ post, journal, href, key }) => (
          <article key={key} className="grid gap-x-10 gap-y-4 border-b border-stone-300 py-6 dark:border-stone-700 md:grid-cols-[minmax(0,1.1fr)_minmax(13rem,0.9fr)] md:items-end">
            <div className="grid gap-2">
              <span className="font-mono text-[0.65rem] tracking-[0.12em] text-stone-500">{journal}</span>
              <SfiPostHeader post={post} href={href} />
            </div>
            {post.excerpt ? (
              <p className="m-0 max-w-sm font-serif text-xs italic leading-5 text-stone-450 md:justify-self-end">{post.excerpt}</p>
            ) : null}
          </article>
        ))}
      </div>
    </CreativeShell>
  );
}
