import type { Metadata } from "next";
import { ProjectShell } from "@/components/science/science-content";
import { ProjectFigure } from "@/components/science/project-figure";
import { tidyTuesdayPlots } from "@/lib/tidytuesday";

export const metadata: Metadata = {
  title: "tidy tuesday",
  description: "Experiments in data visualization and scientific communication by Aaron Wright.",
  alternates: { canonical: "/cognitive-science/projects/tidy-tuesday" },
};

export default function TidyTuesdayProjectPage() {
  return (
    <ProjectShell title="tidy tuesday" subtitle="experiments in communicating patterns through data">
      <p>
        A space for exploring how visual choices help us notice patterns, ask better questions, and communicate data.
        Part of my creative work in cognitive science, with analyses in R and Python.
      </p>
      <p>
        <a href="https://github.com/aaronwriight/tidytuesday">Explore the TidyTuesday source repository</a>.
        New studies will appear here as they are ready to share, alongside the earlier project below.
      </p>
      {tidyTuesdayPlots.length > 0 && (
        <section aria-label="TidyTuesday visualizations" className="space-y-12">
          {tidyTuesdayPlots.map((plot) => (
            <article key={plot.slug} id={plot.slug}>
              <p className="mb-2 text-xs tracking-wide text-stone-500"><time dateTime={plot.date}>{plot.date}</time> · TidyTuesday</p>
              <h2>{plot.title}</h2>
              <p>{plot.description}</p>
              <ProjectFigure src={plot.image} alt={plot.alt} caption={plot.caption} width={plot.width} height={plot.height} />
              <p className="text-xs"><a href={plot.sourceUrl}>Analysis and source</a> · <a href={plot.datasetUrl}>Dataset</a></p>
            </article>
          ))}
        </section>
      )}
      <p className="mb-2 pt-5 text-xs tracking-wide text-stone-500">earlier explorations · undergraduate project</p>
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
