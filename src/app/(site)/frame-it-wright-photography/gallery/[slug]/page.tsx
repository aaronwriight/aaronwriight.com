import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotographyShell } from "@/components/site/site-content";
import { PhotoCollage } from "@/components/photography/photo-layout";
import { photographyGalleries, photographyStudies } from "@/lib/photography";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...photographyStudies, ...photographyGalleries].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = [...photographyStudies, ...photographyGalleries].find((item) => item.slug === slug);
  return { title: `${gallery?.title ?? "gallery"} | photography`, description: gallery?.description, alternates: { canonical: `/frame-it-wright-photography/gallery/${slug}` } };
}

export default async function PhotographyGalleryDetail({ params }: Props) {
  const { slug } = await params;
  const study = photographyStudies.find((item) => item.slug === slug);
  const gallery = photographyGalleries.find((item) => item.slug === slug);
  const item = study ?? gallery;
  if (!item) notFound();
  return (
    <PhotographyShell title={item.title} subtitle={item.subtitle}>
      <Link href="/frame-it-wright-photography/gallery" className="text-xs">← all galleries</Link>
      <p>{item.description}</p>
      {study && <p className="photo-layout-note">{study.category}. A sample gallery structure with empty frames; no session or client is represented.</p>}
      <PhotoCollage images={gallery?.images} shapes={study?.shapes} />
      <div className="border-t border-stone-300 pt-5 dark:border-stone-700">
        {gallery?.picTimeUrl ? <a href={gallery.picTimeUrl} rel="noreferrer" className="text-sm">view the full public gallery on Pic-Time <span aria-hidden="true">↗</span></a> : <p className="m-0 text-sm text-stone-500">{study ? "A full public gallery can accompany this collection when it is ready." : "More photographs to come."}</p>}
      </div>
    </PhotographyShell>
  );
}
