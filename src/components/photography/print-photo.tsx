import Image from "next/image";
import { stampText, type SitePhoto } from "@/lib/photography";

// A photograph shown as a print (.print in globals.css), cropped to a ratio, with its date stamp in the corner.
export function PrintPhoto({
  photo,
  ratio,
  sizes,
  stamp = true,
  priority = false,
  className = "",
}: {
  photo: SitePhoto;
  ratio: string;
  sizes: string;
  stamp?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const text = stamp ? stampText(photo.taken) : "";
  return (
    <span className={`print ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {text && <span className="date-stamp" aria-hidden="true">{text}</span>}
    </span>
  );
}
