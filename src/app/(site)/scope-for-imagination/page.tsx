import type { Metadata } from "next";
import { LatestPost } from "@/components/site/latest-post";
import { JournalShell } from "@/components/site/site-content";
import { getAllSfiPosts, getSfiYears } from "@/lib/sfi-posts";

export const metadata: Metadata = {
  title: "scope for imagination | aaron wright",
  description: "A digital journal for photographs, reflections, life updates, and the occasional rant.",
};

export default async function ScopeForImaginationAboutPage() {
  const posts = await getAllSfiPosts();
  const years = getSfiYears(posts);
  // Newest first, Venture stories included: they are SFI entries too.
  const [latest] = posts;

  return (
    <JournalShell
      title="about"
      subtitle="a digital journal for photographs, reflections, life updates, and the occasional rant"
      years={years.length > 0 ? years : [new Date().getFullYear()]}
    >
      {latest ? <LatestPost post={latest} href={`/scope-for-imagination/${latest.entry}`} /> : null}
    </JournalShell>
  );
}
