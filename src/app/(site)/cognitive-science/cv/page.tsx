import type { Metadata } from "next";
import { ExternalLink, ScienceShell } from "@/components/science/science-content";
import { DocumentPages } from "@/components/site/document-pages";

export const metadata: Metadata = {
  title: "cv",
  description: "Download Aaron Wright's CV",
};

export default function CvPage() {
  return (
    <ScienceShell title="cv">
      <p><ExternalLink href="/files/cv/WrightAaron_cv_2026_current.pdf?v=2026-11-04">download cv</ExternalLink> (with working links)</p>
      <DocumentPages document="cv" title="Aaron Wright, CV" />
    </ScienceShell>
  );
}
