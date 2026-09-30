import type { Metadata } from "next";
import { LiteratureShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "literature",
  description: "Literature",
};

export default function LiteraturePage() {
  return (
    <LiteratureShell title="about" subtitle="coming soon">
      {null}
    </LiteratureShell>
  );
}
