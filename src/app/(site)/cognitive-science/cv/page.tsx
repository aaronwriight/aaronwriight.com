import type { Metadata } from "next";
import { ExternalLink, ScienceShell } from "@/components/science/science-content";

export const metadata: Metadata = {
  title: "cv",
  description: "Download Aaron Wright's CV",
};

export default function CvPage() {
  return (
    <ScienceShell title="cv">
      <p><ExternalLink href="/files/cv/WrightAaron_cv_2026_current.pdf">download cv</ExternalLink></p>
    </ScienceShell>
  );
}
