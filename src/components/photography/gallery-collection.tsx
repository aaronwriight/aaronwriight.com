"use client";

import { useState } from "react";
import { ProjectPlacard } from "@/components/site/project-placard";
import { PhotoMosaic } from "@/components/photography/photo-mosaic";
import type { PhotographyGallery } from "@/lib/photography";

// Every gallery on one page: its placard, then its photographs in justified rows. The filters narrow it to one gallery.
export function GalleryCollection({ galleries, aside }: { galleries: PhotographyGallery[]; aside?: React.ReactNode }) {
  const [shown, setShown] = useState("all");
  const visible = galleries.filter((gallery) => shown === "all" || gallery.slug === shown);
  return (
    <div className="not-prose">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-7 gap-y-2.5 border-y border-stone-300 py-3.5 dark:border-stone-700">
        {galleries.length > 1 && (
          <div role="group" aria-label="Show galleries" className="flex flex-wrap gap-x-[1.125rem] gap-y-1.5">
            {[{ slug: "all", title: "all" }, ...galleries].map(({ slug, title }) => (
              <button key={slug} type="button" aria-pressed={shown === slug} onClick={() => setShown(slug)} className="photo-mosaic-chip">
                {title}
              </button>
            ))}
          </div>
        )}
        {aside}
      </div>
      <div className="space-y-16">
        {visible.map((gallery) => (
          <section key={gallery.slug} aria-label={gallery.title} className="space-y-6">
            <ProjectPlacard category={gallery.category} title={gallery.title} subtitle={gallery.subtitle} description={gallery.description} photo={gallery.images[0]} />
            <PhotoMosaic photos={gallery.images.map((image) => ({ ...image, area: gallery.title }))} />
          </section>
        ))}
      </div>
    </div>
  );
}
