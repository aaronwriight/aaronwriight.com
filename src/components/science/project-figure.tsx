import Image from "next/image";

// The picture framed the way its project placard frames it: a print placard (warm white border, rounded corners, a
// soft lift) holding the picture as a single print, with the caption beneath. At night the picture's white is dimmed.
// `single` drops the inner print, so the picture sits straight on the placard with no frame nested inside.
export function ProjectFigure({ src, alt, caption, width, height, single = false, tall = false }: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  single?: boolean;
  tall?: boolean; // a dense, portrait figure (a paper's multi-panel figure) is let run taller, so its labels stay legible
}) {
  const image = <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 850px, 90vw" className={`mx-auto h-auto ${tall ? "max-h-[68rem]" : "max-h-[36rem]"} w-auto max-w-full object-contain`} />;
  return (
    <figure className="print-placard not-prose my-8 p-5 sm:p-6">
      {single ? <div className="bg-white">{image}</div> : <div className="print bg-white">{image}</div>}
      <figcaption className="mt-4 text-xs text-stone-500">{caption}</figcaption>
    </figure>
  );
}
