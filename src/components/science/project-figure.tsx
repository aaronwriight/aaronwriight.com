import Image from "next/image";

// The picture framed the way its project placard frames it: a hairline rectangle around the picture, set on a white
// card. At night the frame becomes a dark mat and the picture's white is dimmed, as on the placard.
export function ProjectFigure({ src, alt, caption, width, height }: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="not-prose my-8 border border-stone-300 bg-white p-5 sm:p-6 dark:border-stone-700 dark:bg-stone-950">
      <div className="border border-stone-300 bg-white p-3 dark:border-stone-700 dark:bg-paper-tint">
        <div className="bg-white p-1 dark:brightness-[0.88]">
          <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 850px, 90vw" className="mx-auto h-auto max-h-[36rem] w-auto max-w-full object-contain" />
        </div>
      </div>
      <figcaption className="mt-4 text-xs text-stone-500">{caption}</figcaption>
    </figure>
  );
}
