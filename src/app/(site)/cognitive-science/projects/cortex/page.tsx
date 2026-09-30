import type { Metadata } from "next";
import { ProjectShell } from "@/components/science/science-content";
import { ProjectFigure } from "@/components/science/project-figure";

export const metadata: Metadata = {
  title: "cortex",
  description: "The tidyverse for computational neuroscience.",
};

export default function CortexProjectPage() {
  return (
    <ProjectShell title="cortex" subtitle="the tidyverse for computational neuroscience.">
      <p>
        Cortex is a modular ecosystem for computational neuroscience, built around a shared approach to data, analysis, and visualization.
        The aim is to make scientific workflows easier to follow, compose, and reproduce.
      </p>
      <ProjectFigure
        src="/images/projects/cortex.png"
        alt="Cortex artwork connecting preprocessing, modeling, mapping, and visualization."
        caption="The Cortex workflow, illustrated."
        width={1200}
        height={600}
      />
      <p>This project is in development; more about its tools and the thinking behind them to come.</p>
    </ProjectShell>
  );
}
