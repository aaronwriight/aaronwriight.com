"use client";

import Image from "next/image";
import { useState } from "react";
import { PhotoViewer, type ViewerPhoto } from "@/components/photography/photo-viewer";
import { spreadPlace } from "@/components/photography/spread-place";

// The portfolio: the favourites set out irregularly (see spread-place.ts), each with its note.

export function PhotoSpread({ photos, aside }: { photos: ViewerPhoto[]; aside?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="not-prose">
      {aside && <div className="mb-10 flex justify-end border-y border-stone-300 py-3.5 dark:border-stone-700">{aside}</div>}
      <div className="photo-spread">
        {photos.map((photo, index) => {
          const { span, width, style: place } = spreadPlace(index, photo.height >= photo.width * 0.95);
          return (
            <figure key={photo.src} className="photo-spread-item" style={place}>
              <button type="button" aria-haspopup="dialog" onClick={() => setOpen(index)}>
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={`(min-width: 1024px) ${Math.ceil((span / 12) * 1000)}px, ${width}vw`} />
              </button>
              {photo.caption && <figcaption className="photo-spread-note">{photo.caption}</figcaption>}
            </figure>
          );
        })}
      </div>
      <PhotoViewer photos={photos} index={open} onChange={setOpen} />
    </div>
  );
}
