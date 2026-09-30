import type { Metadata } from "next";
import Link from "next/link";
import { CreativeShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "about | creative",
  description: "Photography, travel, writing, and music projects by Aaron Wright.",
};

export default function CreativeAboutPage() {
  return (
    <CreativeShell>
      <p>I take photographs, keep a journal, and have a few writing and music projects in progress.</p>
      <p><Link href="/creative/projects">Explore the projects →</Link></p>
    </CreativeShell>
  );
}
