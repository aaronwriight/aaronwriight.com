import type { Metadata } from "next";
import { ProjectShell } from "@/components/science/science-content";
import { ProjectFigure } from "@/components/science/project-figure";

export const metadata: Metadata = {
  title: "tidy tuesday",
  description: "Tidy Tuesday visualizations by Aaron Wright",
};

export default function TidyTuesdayProjectPage() {
  return (
    <ProjectShell title="tidy tuesday" subtitle="experiments in communicating patterns through data">
      <p>
        A space for visual explorations with R and the tidyverse. For now, a visualization from an undergraduate project.
      </p>
      <h2>Twitter sentiment</h2>
      <p>
        An exploration of sentiment in tweets about Twitter’s free-speech policies over time, with annotations of Elon Musk’s Twitter activity.
      </p>
      <ProjectFigure
        src="/images/projects/tidy-tuesday.png"
        alt="An annotated bar chart of hourly AFINN sentiment scores for tweets about Twitter’s free-speech policies, alongside Elon Musk’s Twitter activity."
        caption="Hourly sentiment scores from an undergraduate data science project."
        width={1200}
        height={900}
      />
    </ProjectShell>
  );
}
