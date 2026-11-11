import published from "../../content/photography/published.json";
import stamps from "../../content/photography/stamps.json";
import home from "../../content/photography/home.json";
import { photographyCategories, photographySessions } from "@/data/photography";

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

// A photograph as the pages use it: its session (for labels and the viewer) and its capture date for the stamp.
export type SitePhoto = PhotographyImage & { area?: string; taken?: string };

const areaOrder = (category: string) => {
  const index = (photographyCategories as readonly string[]).indexOf(category);
  return index < 0 ? photographyCategories.length : index;
};

// Only explicit publishing writes this portable, public catalog. Drafts and
// personal originals are never read by the application or a Vercel build.
// Galleries follow the content-area order, whatever order they were published in.
export const photographyGalleries = [...(published as PhotographyGallery[])].sort((a, b) => areaOrder(a.category) - areaOrder(b.category));

// Capture dates (YYYY-MM-DD) from scripts/photo_stamps.py; photographs without one get no stamp.
const takenOn = stamps as Record<string, string>;
const withStamp = (image: PhotographyImage, area?: string): SitePhoto => ({ ...image, area, taken: takenOn[image.src] });

// The portfolio favourites: every image marked portfolio, labelled with its gallery.
export const portfolioPhotos = photographyGalleries.flatMap((gallery) =>
  gallery.images.filter((image) => image.portfolio).map((image) => withStamp(image, gallery.title)),
);

// Every published photograph in a session's categories, favourites first.
export function sessionPhotos(slug: string): SitePhoto[] {
  const session = photographySessions.find((item) => item.slug === slug);
  if (!session) return [];
  const categories = session.categories as readonly string[];
  const photos = photographyGalleries
    .filter((gallery) => categories.includes(gallery.category))
    .flatMap((gallery) => gallery.images.map((image) => withStamp(image, session.title)));
  return [...photos.filter((photo) => photo.portfolio), ...photos.filter((photo) => !photo.portfolio)];
}

// The photograph that stands for a session (its first favourite), if it has any.
export const sessionCover = (slug: string): SitePhoto | undefined => sessionPhotos(slug)[0];

// Photographs for the photography home and other pages: favourites first, then the rest, one session at a time in
// turn so no session crowds a row. Travel and events photographs are included here, never in the portfolio.
export const featuredPhotos: SitePhoto[] = (() => {
  const galleries = photographyGalleries.map((gallery) => [
    ...gallery.images.filter((image) => image.portfolio),
    ...gallery.images.filter((image) => !image.portfolio),
  ].map((image) => withStamp(image, gallery.title)));
  const order: SitePhoto[] = [];
  for (let round = 0; galleries.some((list) => round < list.length); round++) {
    for (const list of galleries) if (list[round]) order.push(list[round]);
  }
  return order;
})();

// The photographs chosen by hand in content/photography/home.json: the front door's photography plaque and the photography
// home's two-row collage. A path that is no longer published is skipped.
const bySrc = new Map(photographyGalleries.flatMap((gallery) => gallery.images.map((image) => [image.src, withStamp(image, gallery.title)] as const)));
export const chosenPhotos = {
  plaque: bySrc.get(home.plaque),
  collage: home.collage.map((row) => row.map((src) => bySrc.get(src)).filter((photo): photo is SitePhoto => !!photo)).filter((row) => row.length > 0),
};

// Pick photographs by shape from the featured order, skipping ones already used on the page.
export function pickPhotos(count: number, used: Set<string>, shape?: (photo: SitePhoto) => boolean) {
  const picked: SitePhoto[] = [];
  for (const photo of featuredPhotos) {
    if (picked.length === count) break;
    if (used.has(photo.src) || (shape && !shape(photo))) continue;
    used.add(photo.src);
    picked.push(photo);
  }
  return picked;
}

export const isUpright = (photo: SitePhoto) => photo.height > photo.width * 1.05;
export const isWide = (photo: SitePhoto) => photo.width > photo.height * 1.05;

export { stampText } from "@/lib/stamp";

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
