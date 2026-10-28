"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type MosaicPhoto = { src: string; alt: string; width: number; height: number; area?: string };

type Mode = { target: number; width: number };
// Target row height as a share of the row width, and a nominal width for weighing the gaps: about two portraits a
// row on phones, three on tablets, four on wide screens. Rows are sized in proportions, so any width within a mode fits.
const MODES = { narrow: { target: 0.62, width: 380 }, medium: { target: 0.4, width: 640 }, wide: { target: 0.27, width: 1000 } };
const GAP = 12;

// Choose row breaks that keep every row, the last included, close to the target height (like justified text).
function partition<T extends MosaicPhoto>(items: T[], { target, width }: Mode) {
  const height = target * width;
  const cost = new Array<number>(items.length + 1).fill(Infinity);
  const previous = new Array<number>(items.length + 1).fill(0);
  cost[0] = 0;
  const maxPerRow = Math.max(1, Math.ceil(width / (height * 0.5)));
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

export function PhotoMosaic({ photos, filters = false, aside }: { photos: MosaicPhoto[]; filters?: boolean; aside?: React.ReactNode }) {
  const areas = [...new Set(photos.map((photo) => photo.area).filter((area): area is string => !!area))];
  const [area, setArea] = useState("all");
  const [mode, setMode] = useState<keyof typeof MODES>("wide");
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);

  const visible = useMemo(() => photos.filter((photo) => area === "all" || photo.area === area), [photos, area]);
  const rows = useMemo(() => partition(visible, MODES[mode]), [visible, mode]);

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

  useEffect(() => {
    const dialog = viewer.current;
    if (open !== null && dialog && !dialog.open) dialog.showModal();
    if (open === null && dialog?.open) dialog.close();
  }, [open]);

  const step = (offset: number) => setOpen((index) => (index === null ? null : (index + offset + visible.length) % visible.length));
  const current = open === null ? null : visible[open];
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
      <div ref={grid} className="photo-mosaic">
        {rows.map((row) => {
          const rowRatio = row.reduce((sum, photo) => sum + photo.width / photo.height, 0);
          return (
            <div key={row[0].src} className="photo-mosaic-row">
              {row.map((photo) => {
                const position = index++;
                const share = photo.width / photo.height / rowRatio;
                return (
                  <button key={photo.src} type="button" aria-haspopup="dialog" onClick={() => setOpen(position)} className="photo-mosaic-tile" style={{ flexGrow: photo.width / photo.height, aspectRatio: `${photo.width} / ${photo.height}` }}>
                    <Image src={photo.src} alt={photo.alt} fill sizes={`(min-width: 768px) ${Math.ceil(share * 1200)}px, ${Math.ceil(share * 100)}vw`} className="object-cover" />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <dialog
        ref={viewer}
        aria-label="Photograph viewer"
        className="photo-viewer"
        onClose={() => setOpen(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
      >
        {current && (
          <div className="photo-viewer-frame">
            <div
              className="photo-viewer-stage"
              onPointerDown={(event) => (swipe.current = event.clientX)}
              onPointerUp={(event) => {
                const distance = swipe.current === null ? 0 : event.clientX - swipe.current;
                swipe.current = null;
                if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
              }}
            >
              <div className="relative h-full w-full">
                <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" draggable={false} className="object-contain" />
              </div>
              <button type="button" className="photo-mosaic-chip photo-viewer-nav left-4" onClick={() => step(-1)} aria-label="Previous photograph">
                ← prev
              </button>
              <button type="button" className="photo-mosaic-chip photo-viewer-nav right-4" onClick={() => step(1)} aria-label="Next photograph">
                next →
              </button>
            </div>
            <div className="photo-viewer-bar">
              <span>{current.area}</span>
              <span>
                {open! + 1} / {visible.length}
              </span>
              <button type="button" className="photo-mosaic-chip" onClick={() => setOpen(null)}>
                close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
