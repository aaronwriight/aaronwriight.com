import type { Metadata } from "next";
import { ProjectShell } from "@/components/science/science-content";
import { ProjectFigure } from "@/components/science/project-figure";

export const metadata: Metadata = {
  title: "cortex",
  description: "The tidyverse for computational neuroscience.",
  // The Cortex card (November 2026) is also the link preview for this page.
  openGraph: { images: [{ url: "/images/projects/cortex-social-card.png", width: 2560, height: 1440, alt: "Cortex: a modular ecosystem for multimodal neuroimaging analysis." }] },
  twitter: { card: "summary_large_image", images: ["/images/projects/cortex-social-card.png"] },
};

export default function CortexProjectPage() {
  return (
    <ProjectShell title="cortex" subtitle="the tidyverse for computational neuroscience.">
      <p>
        Cortex is a modular ecosystem for computational neuroscience, built around a shared approach to data, analysis, and visualization.
        The aim is to make scientific workflows easier to follow, compose, and reproduce.
      </p>
      <ProjectFigure
        src="/images/projects/cortex-social-card.png"
        alt="Cortex artwork: a brain with language regions shaded in orange, ringed by its workflow (preprocess, segment, model, map, analyze, visualize), on contour lines."
        caption="The Cortex workflow, illustrated."
        width={2560}
        height={1440}
      />
      <p>This project is in development; more about its tools and the thinking behind them to come.</p>
    </ProjectShell>
  );
}
