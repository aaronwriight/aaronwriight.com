import type { Metadata } from "next";
import { CreativeProjectShell } from "@/components/site/site-content";

export const metadata: Metadata = { title: "theory of change | creative", description: "A music project by Aaron Wright, coming soon." };

export default function TheoryOfChangePage() {
  return <CreativeProjectShell title="theory of change"><p>Music. Coming soon.</p></CreativeProjectShell>;
}
