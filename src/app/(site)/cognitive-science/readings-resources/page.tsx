import type { Metadata } from "next";
import { ScienceShell } from "@/components/science/science-content";
import { ReadingsResourceBrowser } from "@/components/science/readings-resource-browser";

export const metadata: Metadata = {
  title: "resources",
  description: "Curated cognitive science readings and resources",
};

export default function ReadingsResourcesPage() {
  return (
    <ScienceShell title="resources">
      <p>
        One of the marks of a diligent scholar is the ability to engage with a variety of literature, appreciate its contributions, and yet
        exercise selectivity in adopting its perspectives.
      </p>
      <p>
        Below are several readings and resources I&apos;ve found useful for navigating cognitive science. I&apos;ve included pieces I agree with, as
        well as ones with which I don&apos;t: the common denominator is that they&apos;ve made me think critically.
      </p>

      <ReadingsResourceBrowser />
    </ScienceShell>
  );
}
