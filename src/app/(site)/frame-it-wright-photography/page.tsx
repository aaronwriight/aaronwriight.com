import type { Metadata } from "next";
import { PhotographyShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "Frame It Wright Photography",
  description: "Frame It Wright Photography",
  alternates: { canonical: "/frame-it-wright-photography" },
};

export default function FrameItWrightPhotographyPage() {
  return (
    <PhotographyShell title="about">
      <p>More about Frame It Wright Photography is coming soon.</p>
    </PhotographyShell>
  );
}
