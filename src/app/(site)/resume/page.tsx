import type { Metadata } from "next";
import { ExternalLink } from "@/components/science/science-content";
import { ContactShell } from "@/components/site/site-content";
import { DocumentPages } from "@/components/site/document-pages";

export const metadata: Metadata = {
  title: "resume",
  description: "Download Aaron Wright's resume",
};

export default function ResumePage() {
  return (
    <ContactShell title="resume">
      <p><ExternalLink href="/files/resume/WrightAaron_resume_Research_2026_current.pdf?v=2026-11-04">download resume</ExternalLink> (with working links)</p>
      <DocumentPages document="resume" title="Aaron Wright, resume" />
    </ContactShell>
  );
}
