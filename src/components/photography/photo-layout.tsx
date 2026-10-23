import Image from "next/image";
import type { PhotographyImage } from "@/lib/photography";

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

export function PhotoCollage({ images = [], shapes = ["portrait", "landscape", "square", "square", "landscape", "portrait"] }: { images?: PhotographyImage[]; shapes?: readonly Shape[] }) {
  return (
    <div className="photo-collage not-prose">
      {images.length ? images.map((item) => (
        <figure key={item.src} className={`photo-collage-item photo-collage-item--${item.shape}`}>
          <div className={`photo-image photo-placeholder--${item.shape}`}>
            <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 90vw" />
          </div>
          {item.caption && <figcaption className="mt-3 text-xs leading-relaxed text-stone-500">{item.caption}</figcaption>}
        </figure>
      )) : shapes.map((shape, index) => (
        <div key={index} className={`photo-collage-item photo-collage-item--${shape}`}>
          <PhotoPlaceholder shape={shape} number={String(index + 1).padStart(2, "0")} />
        </div>
      ))}
    </div>
  );
}
