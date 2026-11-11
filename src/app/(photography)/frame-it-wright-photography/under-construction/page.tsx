import type { Metadata } from "next";
import { FrameItWright } from "@/components/photography/photo-chrome";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: { absolute: "Frame it Wright Photography" },
  description: "Frame it Wright Photography is under construction.",
  robots: { index: false, follow: false },
};

// While the photography site is locked (PHOTOGRAPHY_LOCKED in next.config.mjs), every photography address, on
// frameitwright.com and under /frame-it-wright-photography, is served this page and nothing else.
export default function UnderConstructionPage() {
  return (
    <section className="print-placard mx-auto w-[min(92vw,32rem)] px-7 py-8 sm:px-9 sm:py-10">
      <p className="fiw-mono m-0 text-stone-500">under construction</p>
      <h1 className="fiw-title m-0 mt-4 text-[clamp(2rem,6vw,2.75rem)]">
        <FrameItWright />
      </h1>
      <p className="m-0 mt-4 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
        is still being built: photographs are going up and the last few pages are being written. Thanks for your patience,
        it&apos;s nearly there!
      </p>
      <p className="m-0 mt-6 text-sm">
        In the meantime, find me at <a href={siteUrl} className="fiw-link">aaronwriight.com</a>.
      </p>
    </section>
  );
}
