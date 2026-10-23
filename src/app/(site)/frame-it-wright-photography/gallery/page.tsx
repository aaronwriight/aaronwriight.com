import type { Metadata } from "next";
import { PhotographyShell } from "@/components/site/site-content";
import Link from "next/link";
import { ProjectPlacard } from "@/components/site/project-placard";
import { PhotoPlaceholder } from "@/components/photography/photo-layout";
import { photographyGalleries, photographyStudies } from "@/lib/photography";
import { picTimeClientUrl } from "@/data/photography";

export const metadata: Metadata = {
  title: "photography gallery",
  description: "Gallery studies and client gallery access for Frame It Wright Photography.",
  alternates: { canonical: "/frame-it-wright-photography/gallery" },
};

export default function PhotographyGalleryPage() {
  return (
    <PhotographyShell title="galleries" subtitle="a little more of the story">
      <p>Room for a session, an occasion, or an unfolding photo essay. Each collection will have a few opening frames here, with its full public gallery on Pic-Time when available.</p>
      {photographyGalleries.length > 0 && <section aria-label="Public galleries" className="not-prose space-y-6">
        {photographyGalleries.map((gallery) => <ProjectPlacard key={gallery.slug} {...gallery} href={`/frame-it-wright-photography/gallery/${gallery.slug}`} image={gallery.images[0]?.src} alt={gallery.images[0]?.alt} linkLabel="view gallery" />)}
      </section>}
      <section aria-labelledby="gallery-studies" className="not-prose space-y-6">
        <div>
          <h2 id="gallery-studies" className="m-0 font-serif text-sm">gallery studies</h2>
          <p className="mb-0 mt-2 text-sm leading-relaxed text-stone-500">Three example layouts, ready to think with. These are placeholders, not client galleries; no photographs have been chosen.</p>
        </div>
        {photographyStudies.map((study, index) => <ProjectPlacard key={study.slug} {...study} href={`/frame-it-wright-photography/gallery/${study.slug}`} preview={<PhotoPlaceholder compact number={String(index + 1).padStart(2, "0")} shape={study.shapes[0]} />} linkLabel="explore the layout" headingLevel="h3" />)}
      </section>
      <section id="client-galleries" aria-labelledby="client-galleries-title" className="not-prose border-t border-stone-300 pt-7 dark:border-stone-700">
        <p className="mb-2 mt-0 text-[0.65rem] uppercase tracking-[0.18em] text-stone-500">for clients</p>
        <h2 id="client-galleries-title" className="m-0 font-serif text-lg font-normal">looking for your photographs?</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed">Your photographs live on Pic-Time. Continue to my gallery page there to find your collection and follow the sign-in or access instructions.</p>
        <a href={picTimeClientUrl} className="mt-4 inline-flex items-center gap-3 border border-stone-400 px-4 py-3 text-sm text-stone-900 hover:border-olive focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal dark:border-stone-600 dark:text-stone-100" aria-label="Find your photographs on Pic-Time — continue to the gallery and sign-in page">
          find your photographs on Pic-Time <span aria-hidden="true">↗</span>
        </a>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-500">You’ll continue on Pic-Time, which manages gallery access and sign-in. If your collection isn’t listed, use the invitation sent to your email, or get in touch and I can help you find it.</p>
        <Link href="mailto:frameitwright@gmail.com" className="mt-3 inline-block text-xs">need a hand? email me <span aria-hidden="true">→</span></Link>
      </section>
    </PhotographyShell>
  );
}
