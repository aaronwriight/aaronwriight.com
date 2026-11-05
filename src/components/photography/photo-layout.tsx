import { picTimeClientUrl } from "@/data/photography";
import { spreadPlace } from "@/components/photography/spread-place";

// Clients find their delivered galleries on Pic-Time; the portfolio and galleries here are the public work.
export function ClientGalleryLine() {
  return (
    <p className="m-0 text-[0.8rem] tracking-[0.04em] text-stone-500">
      looking for your photos? <a href={picTimeClientUrl} className="border-b border-current text-olive">find your gallery</a>
    </p>
  );
}

type Shape = "portrait" | "landscape" | "square";

export function PhotoPlaceholder({ shape = "landscape", number = "01", compact = false }: { shape?: Shape; number?: string; compact?: boolean }) {
  return (
    <div className={`photo-placeholder photo-placeholder--${shape} ${compact ? "photo-placeholder--compact" : ""}`}>
      <span className="photo-placeholder-number" aria-hidden="true">{number}</span>
      <span className="photo-placeholder-frame" aria-hidden="true" />
      <span className="photo-placeholder-label">{compact ? "gallery preview to come" : `${shape} · image to come`}</span>
    </div>
  );
}

// Empty frames set out like the portfolio's photographs (spread-place.ts): staggered pairs on wide screens, varied
// widths in one column on narrow ones. Seven shapes make one full turn of the arrangement.
export function PhotoCollage({ shapes = ["portrait", "landscape", "square", "square", "landscape", "portrait", "landscape"] }: { shapes?: readonly Shape[] }) {
  return (
    <div className="photo-spread not-prose">
      {shapes.map((shape, index) => (
        <div key={index} className="photo-spread-item" style={spreadPlace(index, shape !== "landscape").style}>
          <PhotoPlaceholder shape={shape} number={String(index + 1).padStart(2, "0")} />
        </div>
      ))}
    </div>
  );
}
