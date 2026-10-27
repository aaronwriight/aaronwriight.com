import type { Metadata } from "next";
import { LatestPost } from "@/components/site/latest-post";
import { VentureShell } from "@/components/site/site-content";
import { getAllVentureEntries } from "@/lib/venture-entries";

export const metadata: Metadata = {
  title: "about | venture",
  description: "An author's note about Venture, coming soon.",
};

export default async function VentureAboutPage() {
  const [latest] = await getAllVentureEntries();

  return (
    <VentureShell title="about" subtitle="an author's note is coming soon">
      {latest ? <LatestPost post={latest} href={`/venture/${latest.slug}`} /> : null}
    </VentureShell>
  );
}
