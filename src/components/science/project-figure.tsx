import Image from "next/image";

// The picture framed the way its project placard frames it: a print placard (warm white border, rounded corners, a
// soft lift) holding the picture as a single print, with the caption beneath. At night the picture's white is dimmed.
export function ProjectFigure({ src, alt, caption, width, height }: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="print-placard not-prose my-8 p-5 sm:p-6">
      <div className="print bg-white">
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 850px, 90vw" className="mx-auto h-auto max-h-[36rem] w-auto max-w-full object-contain" />
      </div>
      <figcaption className="mt-4 text-xs text-stone-500">{caption}</figcaption>
    </figure>
  );
}
