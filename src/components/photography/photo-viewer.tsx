"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type ViewerPhoto = { src: string; alt: string; width: number; height: number; area?: string; caption?: string };

// Full-screen viewer shared by the portfolio and the galleries: arrow keys or a swipe step through, Esc closes.
export function PhotoViewer({ photos, index, onChange }: { photos: ViewerPhoto[]; index: number | null; onChange: (index: number | null) => void }) {
  const viewer = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);

  useEffect(() => {
    const dialog = viewer.current;
    if (index !== null && dialog && !dialog.open) dialog.showModal();
    if (index === null && dialog?.open) dialog.close();
  }, [index]);

  const step = (offset: number) => index !== null && onChange((index + offset + photos.length) % photos.length);
  const current = index === null ? null : photos[index];

  return (
    <dialog
      ref={viewer}
      aria-label="Photograph viewer"
      className="photo-viewer"
      onClose={() => onChange(null)}
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
              prev
            </button>
            <button type="button" className="photo-mosaic-chip photo-viewer-nav right-4" onClick={() => step(1)} aria-label="Next photograph">
              next
            </button>
          </div>
          {current.caption && <p className="photo-viewer-caption">{current.caption}</p>}
          <div className="photo-viewer-bar">
            <span>{current.area}</span>
            <span>
              {index! + 1} / {photos.length}
            </span>
            <button type="button" className="photo-mosaic-chip" onClick={() => onChange(null)}>
              close
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
