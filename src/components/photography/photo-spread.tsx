"use client";

import Image from "next/image";
import { useState } from "react";
import { PhotoViewer, type ViewerPhoto } from "@/components/photography/photo-viewer";

// An irregular, repeating arrangement for the portfolio. On wide screens each photograph takes a place on a 12-column
// grid (start column, span for landscape and upright frames, drop from the top in rem); pairs share a row and sit at
// different heights. On narrow screens it is one column, with the width and left offset (percent) varying instead.
const SLOTS = [
  { start: 1, landscape: 8, upright: 5, top: 0, width: 100, left: 0 },
  { start: 9, landscape: 4, upright: 4, top: 7, width: 72, left: 28 },
  { start: 3, landscape: 7, upright: 4, top: 3, width: 86, left: 0 },
  { start: 10, landscape: 3, upright: 3, top: 9, width: 64, left: 18 },
  { start: 5, landscape: 8, upright: 5, top: 2, width: 100, left: 0 },
  { start: 1, landscape: 6, upright: 4, top: 4, width: 78, left: 22 },
  { start: 8, landscape: 5, upright: 4, top: 8, width: 70, left: 6 },
];

export function PhotoSpread({ photos, aside }: { photos: ViewerPhoto[]; aside?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="not-prose">
      {aside && <div className="mb-10 flex justify-end border-y border-stone-300 py-3.5 dark:border-stone-700">{aside}</div>}
      <div className="photo-spread">
        {photos.map((photo, index) => {
          const slot = SLOTS[index % SLOTS.length];
          const upright = photo.height >= photo.width * 0.95;
          const span = upright ? slot.upright : slot.landscape;
          const width = upright ? Math.round(slot.width * 0.85) : slot.width;
          const place = { "--col": `${slot.start} / span ${span}`, "--top": `${slot.top}rem`, "--w": `${width}%`, "--ml": `${slot.left}%` } as React.CSSProperties;
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
