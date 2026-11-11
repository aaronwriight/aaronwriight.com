import type { Metadata } from "next";
import Link from "next/link";
import { CreateWithMe } from "@/components/photography/create-with-me";
import { FrameItWright } from "@/components/photography/photo-chrome";
import { PrintPhoto } from "@/components/photography/print-photo";
import { kudos, photographySessions, photoPath } from "@/data/photography";
import { chosenPhotos, isUpright, pickPhotos, sessionCover } from "@/lib/photography";

export const metadata: Metadata = {
  title: { absolute: "Frame it Wright Photography" },
  description: "Weddings, couples, families, graduates, and portraits, photographed by Aaron Wright.",
  alternates: { canonical: "/" },
};

// The photography home: the name, a hello, the five sessions in a warm white band, one kudos, then a collage of
// chosen photographs in two rows, each keeping its own shape (content/photography/home.json), and the invitation.
export default function FrameItWrightPhotographyPage() {
  const used = new Set<string>();
  const covers = photographySessions.map((session) => ({ session, photo: sessionCover(session.slug) }));
  covers.forEach(({ photo }) => photo && used.add(photo.src));
  chosenPhotos.collage.flat().forEach((photo) => used.add(photo.src));
  const hello = pickPhotos(1, used, isUpright)[0];
  const note = kudos[0];

  return (
    <>
      <section className="fiw-wrap flex flex-wrap items-end justify-between gap-x-12 gap-y-5 pt-14 pb-12 md:pt-20 md:pb-16">
        <h1 className="fiw-title m-0 text-[clamp(3rem,8vw,5.75rem)]">
          <FrameItWright />
        </h1>
        <p className="m-0 max-w-sm text-lg leading-snug text-stone-600 dark:text-stone-400">
          Weddings, couples, families, graduates, and portraits, wherever you&apos;d like to go.
        </p>
      </section>

      <section aria-labelledby="hello" className="fiw-wrap grid items-center gap-8 pb-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-14">
        {hello && <PrintPhoto photo={hello} ratio="4 / 5" sizes="(min-width: 768px) 40vw, 100vw" priority />}
        <div className="grid gap-4">
          <span className="fiw-eyebrow">hello</span>
          <h2 id="hello" className="fiw-title m-0 text-[2.4rem]">Hi! I&apos;m Aaron.</h2>
          <p className="m-0 max-w-lg text-lg leading-relaxed">
            I photograph people: the two of you, your whole crew, your big day, or just you. I&apos;ll help you feel at ease, and we&apos;ll make photographs that look like you on your best day.
          </p>
          <p className="m-0">
            <Link href={photoPath("/about")} className="fiw-link">more about me</Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="sessions" className="fiw-band">
        <div className="fiw-wrap py-14">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="sessions" className="fiw-title m-0 text-[2.4rem]">sessions</h2>
            <span className="fiw-mono text-wright">01–05</span>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-7 p-0 sm:grid-cols-3 lg:grid-cols-5">
            {covers.map(({ session, photo }, index) => (
              <li key={session.slug}>
                <Link href={photoPath(`/portfolio/${session.slug}`)} className="fiw-session-card grid gap-2.5">
                  {photo ? (
                    <PrintPhoto photo={photo} ratio="2 / 3" sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 48vw" />
                  ) : (
                    <span className="fiw-empty aspect-[2/3]">to come</span>
                  )}
                  <span className="fiw-mono text-wright">▸ {String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[1.2rem] italic leading-tight">{session.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Kudos" className="fiw-wrap py-16 text-center">
        <blockquote className="fiw-note m-0 mx-auto max-w-2xl">“{note.quote}”</blockquote>
        <p className="fiw-mono mt-4 text-stone-500">{note.by} · {note.session}</p>
      </section>

      {chosenPhotos.collage.length > 0 && (
        <div className="fiw-wrap fiw-collage">
          {chosenPhotos.collage.map((row) => {
            const rowRatio = row.reduce((sum, photo) => sum + photo.width / photo.height, 0);
            return (
              <div key={row[0].src} className="fiw-collage-row">
                {row.map((photo) => (
                  <span key={photo.src} className="fiw-collage-tile" style={{ flexGrow: photo.width / photo.height }}>
                    <PrintPhoto photo={photo} ratio={`${photo.width} / ${photo.height}`} sizes={`(min-width: 768px) ${Math.ceil(((photo.width / photo.height) / rowRatio) * 1200)}px, 50vw`} />
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <CreateWithMe />
    </>
  );
}
