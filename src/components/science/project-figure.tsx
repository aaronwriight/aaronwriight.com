import Image from "next/image";

// A figure on a project's own page: one print, cut to the picture (a warm white border, rounded corners, a soft lift)
// with the caption beneath it, never a placard with a second print nested inside. The picture always sits on white,
// so figures drawn on a transparent ground keep their shading at night, where the whole print is dimmed a little.
// `tall` is for a dense portrait figure (a paper's multi-panel figure), let run taller so its labels stay legible.
// `wrap` floats the figure to one side so the text runs around it (.wrap-left / .wrap-right in globals.css); on
// phones it sits in the column like any other figure.
export function ProjectFigure({ src, alt, caption, width, height, tall = false, wrap }: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  tall?: boolean;
  wrap?: "left" | "right";
}) {
  const limits = wrap
    ? "w-auto max-h-[26rem] md:max-h-none md:w-full"
    : tall ? "w-auto max-h-[46rem]" : "w-auto max-h-[26rem] max-w-[44rem]";
  return (
    <figure className={`project-figure not-prose my-8 flex flex-col items-center ${wrap ? `wrap-${wrap}` : ""}`}>
      <div className={`print max-w-full ${wrap ? "md:w-full" : ""}`}>
        <div className="bg-[#ffffff] p-1.5 sm:p-2">
          <Image src={src} alt={alt} width={width} height={height} sizes={wrap ? "(min-width: 768px) 380px, 90vw" : "(min-width: 1024px) 720px, 90vw"} className={`block h-auto max-w-full ${limits}`} />
        </div>
      </div>
      <figcaption className="mt-3 max-w-[44rem] text-center text-xs leading-relaxed text-stone-500">{caption}</figcaption>
    </figure>
  );
}
