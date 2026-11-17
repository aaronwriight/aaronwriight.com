"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PhotoViewer, type ViewerPhoto } from "@/components/photography/photo-viewer";
import { stampText } from "@/lib/stamp";

export type MosaicPhoto = ViewerPhoto & { taken?: string };

type Mode = { target: number; width: number; most?: number };
// Target row height as a share of the row width, and a nominal width for weighing the gaps: about two portraits a
// row on phones, three on tablets, four on wide screens. Rows are sized in proportions, so any width within a mode fits.
const MODES = { narrow: { target: 0.62, width: 380 }, medium: { target: 0.4, width: 640 }, wide: { target: 0.27, width: 1000 } };
// Staggered: the portfolio's session pages. Rows of at most two photographs on phones, three on tablets and four on
// wider screens, each whole in its own shape and side by side, never stacked; within a row every other photograph sits
// a little lower, alternating from row to row, so the rows zigzag (.photo-mosaic--staggered).
const STAGGERED_MODES = { narrow: { target: 0.72, width: 380, most: 2 }, medium: { target: 0.47, width: 640, most: 3 }, wide: { target: 0.32, width: 1000, most: 4 } };
const GAP = 12;

// Choose row breaks that keep every row, the last included, close to the target height (like justified text).
function partition<T extends MosaicPhoto>(items: T[], { target, width, most }: Mode) {
  const height = target * width;
  const cost = new Array<number>(items.length + 1).fill(Infinity);
  const previous = new Array<number>(items.length + 1).fill(0);
  cost[0] = 0;
  const maxPerRow = most ?? Math.max(1, Math.ceil(width / (height * 0.5)));
  for (let end = 1; end <= items.length; end++) {
    let ratio = 0;
    for (let start = end - 1; start >= 0 && end - start <= maxPerRow; start--) {
      ratio += items[start].width / items[start].height;
      const miss = ((width - GAP * (end - start - 1)) / ratio - height) / height;
      const total = cost[start] + miss * miss * (miss > 0 ? 1.6 : 1);
      if (total < cost[end]) {
        cost[end] = total;
        previous[end] = start;
      }
    }
  }
  const rows: T[][] = [];
  for (let end = items.length; end > 0; end = previous[end]) rows.unshift(items.slice(previous[end], end));
  return rows;
}

export function PhotoMosaic({ photos, filters = false, aside, staggered = false }: { photos: MosaicPhoto[]; filters?: boolean; aside?: React.ReactNode; staggered?: boolean }) {
  const areas = [...new Set(photos.map((photo) => photo.area).filter((area): area is string => !!area))];
  const [area, setArea] = useState("all");
  const [mode, setMode] = useState<keyof typeof MODES>("wide");
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => photos.filter((photo) => area === "all" || photo.area === area), [photos, area]);
  const rows = useMemo(() => partition(visible, (staggered ? STAGGERED_MODES : MODES)[mode]), [visible, mode, staggered]);

  useEffect(() => {
    const element = grid.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setMode(width < 560 ? "narrow" : width < 860 ? "medium" : "wide");
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  let index = 0;

  return (
    <div className="not-prose">
      {(filters && areas.length > 1) || aside ? (
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-7 gap-y-2.5 border-y border-stone-300 py-3.5 dark:border-stone-700">
          {filters && areas.length > 1 && (
            <div role="group" aria-label="Show photographs from" className="flex flex-wrap gap-x-[1.125rem] gap-y-1.5">
              {["all", ...areas].map((name) => (
                <button key={name} type="button" aria-pressed={area === name} onClick={() => setArea(name)} className="photo-mosaic-chip">
                  {name}
                </button>
              ))}
            </div>
          )}
          {aside}
        </div>
      ) : null}
      <div ref={grid} className={staggered ? "photo-mosaic photo-mosaic--staggered" : "photo-mosaic"}>
        {rows.map((row, rowIndex) => {
          const rowRatio = row.reduce((sum, photo) => sum + photo.width / photo.height, 0);
          return (
            <div key={row[0].src} className="photo-mosaic-row">
              {row.map((photo, place) => {
                const position = index++;
                const share = photo.width / photo.height / rowRatio;
                const lower = staggered && (place + rowIndex) % 2 === 1;
                return (
                  <button key={photo.src} type="button" aria-haspopup="dialog" onClick={() => setOpen(position)} className={lower ? "photo-mosaic-tile photo-mosaic-tile--lower" : "photo-mosaic-tile"} style={{ flexGrow: photo.width / photo.height, aspectRatio: `${photo.width} / ${photo.height}` }}>
                    <Image src={photo.src} alt={photo.alt} fill sizes={staggered ? `${Math.ceil(share * 100)}vw` : `(min-width: 768px) ${Math.ceil(share * 1200)}px, ${Math.ceil(share * 100)}vw`} className="object-cover" />
                    {photo.taken && <span className="date-stamp" aria-hidden="true">{stampText(photo.taken)}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <PhotoViewer photos={visible} index={open} onChange={setOpen} />
    </div>
  );
}
