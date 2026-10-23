import plots from "../../content/tidy-tuesday/plots.json";

export type TidyTuesdayPlot = {
  slug: string;
  title: string;
  date: string;
  description: string;
  caption: string;
  alt: string;
  image: string;
  width: number;
  height: number;
  datasetUrl: string;
  sourceUrl: string;
};

// Only the explicit publishing command writes this deployable catalog. Local
// manifests, source checkouts, and review folders are never read by the site.
export const tidyTuesdayPlots: TidyTuesdayPlot[] = plots;
