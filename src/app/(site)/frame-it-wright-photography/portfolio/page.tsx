import type { Metadata } from "next";
import { PhotographyShell } from "@/components/site/site-content";
import Link from "next/link";
import { PhotoCollage } from "@/components/photography/photo-layout";
import { photographyGalleries } from "@/lib/photography";
import { picTimeClientUrl } from "@/data/photography";

export const metadata: Metadata = {
  title: "photography portfolio",
  description: "A photography portfolio in the making. Space for portraits, places, and moments by Aaron Wright.",
  alternates: { canonical: "/frame-it-wright-photography/portfolio" },
};

export default function PhotographyPortfolioPage() {
  return (
    <PhotographyShell title="portfolio" subtitle="a collection taking shape">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="m-0 max-w-lg">A place for photographs to sit beside one another, and for small moments to become a larger story.</p>
        <Link href="/frame-it-wright-photography/gallery" className="shrink-0 text-xs">explore the galleries <span aria-hidden="true">→</span></Link>
      </div>
      {!photographyGalleries.some((gallery) => gallery.images.some((item) => item.portfolio)) && <p className="photo-layout-note">Layout in progress. These are empty frames; no photographs have been selected.</p>}
      <PhotoCollage images={photographyGalleries.flatMap((gallery) => gallery.images.filter((item) => item.portfolio))} />
      <p className="max-w-xl text-sm">This will be a selection across collections. For a fuller story, explore the <Link href="/frame-it-wright-photography/gallery">gallery previews</Link>; for delivered photographs, continue to <a href={picTimeClientUrl}>my galleries on Pic-Time <span aria-hidden="true">↗</span></a>.</p>
      <div className="flex flex-wrap justify-between gap-3 border-t border-stone-300 pt-5 text-xs dark:border-stone-700">
        <span className="text-stone-500">frame it wright photography</span>
        <Link href="/frame-it-wright-photography/booking">make something together <span aria-hidden="true">→</span></Link>
      </div>
    </PhotographyShell>
  );
}
