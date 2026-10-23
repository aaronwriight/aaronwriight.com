import published from "../../content/photography/published.json";

export type PhotographyImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  shape: "portrait" | "landscape" | "square";
  portfolio: boolean;
};

export type PhotographyGallery = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  picTimeUrl: string;
  images: PhotographyImage[];
};

// Only explicit publishing writes this portable, public catalog. Drafts and
// personal originals are never read by the application or a Vercel build.
export const photographyGalleries = published as PhotographyGallery[];

export const photographyStudies = [
  {
    slug: "study-portraits",
    category: "layout study · 01",
    title: "portraits",
    subtitle: "a face, a gesture, a little room to breathe",
    description: "A sample arrangement for a portrait session: one opening frame, a pair of details, and a quieter closing image.",
    shapes: ["portrait", "square", "square", "landscape"],
  },
  {
    slug: "study-gatherings",
    category: "layout study · 02",
    title: "gatherings",
    subtitle: "a day told in small moments",
    description: "A sample arrangement for an event or shared occasion, moving between a wider scene and the moments within it.",
    shapes: ["landscape", "portrait", "square", "landscape"],
  },
  {
    slug: "study-places",
    category: "layout study · 03",
    title: "places & in-between",
    subtitle: "a place to linger",
    description: "A sample arrangement for a personal photo essay, with space for a view, a detail, and a change of pace.",
    shapes: ["landscape", "square", "portrait", "landscape"],
  },
] as const;
