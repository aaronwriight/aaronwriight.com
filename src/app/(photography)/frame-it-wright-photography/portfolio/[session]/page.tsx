import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateWithMe } from "@/components/photography/create-with-me";
import { PhotoMosaic } from "@/components/photography/photo-mosaic";
import { photographySessions, photoPath } from "@/data/photography";
import { sessionPhotos } from "@/lib/photography";

type Props = { params: Promise<{ session: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return photographySessions.map(({ slug }) => ({ session: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { session: slug } = await params;
  const session = photographySessions.find((item) => item.slug === slug);
  return { title: session?.title ?? "portfolio", description: session?.line, alternates: { canonical: `/portfolio/${slug}` } };
}

// One session's gallery: every photograph in justified rows, with the previous and next sessions above and below, then
// the invitation. The sessions wrap around (wedding follows portraits).
export default async function PhotographySessionPage({ params }: Props) {
  const { session: slug } = await params;
  const index = photographySessions.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const session = photographySessions[index];
  const previous = photographySessions[(index - 1 + photographySessions.length) % photographySessions.length];
  const next = photographySessions[(index + 1) % photographySessions.length];
  const photos = sessionPhotos(slug);

  return (
    <>
      <section className="fiw-wrap grid gap-3 pt-12 pb-8">
        <nav aria-label="Sessions" className="fiw-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-stone-500">
          <Link href={photoPath("/portfolio")}>portfolio · {String(index + 1).padStart(2, "0")} of {String(photographySessions.length).padStart(2, "0")}</Link>
          <span className="flex gap-5">
            <Link href={photoPath(`/portfolio/${previous.slug}`)}>previous</Link>
            <Link href={photoPath(`/portfolio/${next.slug}`)}>next</Link>
          </span>
        </nav>
        <h1 className="fiw-title m-0 text-[clamp(2.6rem,6vw,4.2rem)]">{session.title}</h1>
        <p className="m-0 max-w-xl text-lg text-stone-600 dark:text-stone-400">{session.line}</p>
      </section>
      <div className="fiw-wrap">
        {photos.length > 0 ? (
          <PhotoMosaic photos={photos} />
        ) : (
          <p className="fiw-empty m-0 h-64 rounded-[3px]">photographs to come</p>
        )}
      </div>
      <nav aria-label="Other sessions" className="fiw-wrap flex flex-wrap justify-between gap-4 pt-8">
        <Link href={photoPath(`/portfolio/${previous.slug}`)} className="fiw-link text-lg italic">previous: {previous.title}</Link>
        <Link href={photoPath(`/portfolio/${next.slug}`)} className="fiw-link text-lg italic">next: {next.title}</Link>
      </nav>
      <CreateWithMe session={slug} />
    </>
  );
}
