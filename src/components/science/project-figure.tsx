import Image from "next/image";

export function ProjectFigure({ src, alt, caption, width, height }: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="border border-stone-200 bg-white p-4 dark:border-stone-700 sm:p-6">
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 850px, 90vw" className="mx-auto h-auto max-h-[36rem] w-auto max-w-full object-contain" />
      </div>
      <figcaption className="mt-3 text-xs text-stone-500">{caption}</figcaption>
    </figure>
  );
}
