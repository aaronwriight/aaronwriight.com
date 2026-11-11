import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { photoPath, photographyUnderConstruction } from "@/data/photography";
import { ConstructionPlaque } from "@/components/site/construction-plaque";
import { chosenPhotos, isUpright, portfolioPhotos } from "@/lib/photography";

export const metadata: Metadata = {
  title: "aaron wright | cognitive scientist, photographer, artist",
  description: "aaron wright - cognitive scientist, photographer, artist",
  alternates: { canonical: "/" },
};

const rooms = [
  { room: "science", label: "science", href: "/cognitive-science", tagline: "the social mind in dialogue" },
  { room: "photography", label: "photography", href: photoPath(), tagline: "frame it wright photography" },
  { room: "creative", label: "creative", href: "/creative", tagline: "writing, venture, and the in-between" },
] as const;

// Science's art (for now): a conversation on one line below the word, two speakers taking turns as voice waveforms:
// one in ink above the line, one in rust below it. The line sits clear of the word. Bars are fixed (a seeded
// sequence), so the drawing is the same on every visit and needs no script.
function DialogueArt() {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const axis = 230; // the word sits at 170; the tallest ink bar stops short of it
  const turns: [number, number, "a" | "b"][] = [[24, 80, "a"], [84, 130, "b"], [134, 188, "a"], [192, 236, "b"], [240, 276, "a"]];
  const bars: { x: number; height: number; speaker: "a" | "b" }[] = [];
  for (const [start, end, speaker] of turns) {
    for (let x = start; x < end; x += 4.5) {
      const envelope = Math.sin(((x - start) / (end - start)) * Math.PI);
      bars.push({ x, height: Math.round((0.3 + random() * 0.7) * envelope * (speaker === "a" ? 30 : 38) + 2), speaker });
    }
  }
  const drawing = (
    <>
      <rect className="dialogue-a" x={24} y={axis - 0.4} width={252} height={0.8} />
      {bars.map(({ x, height, speaker }) => (
        <rect key={x} className={`dialogue-${speaker}`} x={x} y={speaker === "a" ? axis - 2 - height : axis + 2} width={3} height={height} rx={1} />
      ))}
    </>
  );
  // The same drawing framed twice: the whole thing for the tall plaques, and just the line, stretched into a thin strip
  // along the bottom edge, for the short, wide plaques stacked on phones and in narrow windows.
  return (
    <>
      <svg className="dialogue-tall" viewBox="0 0 300 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{drawing}</svg>
      <svg className="dialogue-wide" viewBox={`20 ${axis - 46} 260 92`} preserveAspectRatio="none" aria-hidden="true">{drawing}</svg>
    </>
  );
}

// The front door: three tall plaques in the middle of the page, each with a faint peek of its art. Pointing at one
// lifts and widens it, shows its art, and shows its tagline (all in CSS, .front-door in globals.css).
export default function FrontDoorPage() {
  // The photograph chosen in content/photography/home.json (the canyon, IMG_7313), or the first landscape favourite.
  const photo = chosenPhotos.plaque ?? portfolioPhotos.find((item) => !isUpright(item)) ?? portfolioPhotos[0];
  return (
    <>
      {/* Under the site bar, in the footer's warm white: where "scope for imagination" comes from. */}
      <section aria-label="Anne of Green Gables" className="site-section-bar">
        <figure className="site-wrap m-0 grid justify-items-center gap-2 py-5 text-center">
          <blockquote className="m-0 max-w-[60rem] font-serif text-sm italic leading-relaxed text-stone-600 [text-wrap:balance] dark:text-stone-400">
            Well, that is one of the things to find out sometime. Isn&apos;t it splendid to think of all the things there are to
            find out about? It just makes me feel glad to be alive - it&apos;s such an interesting world. It wouldn&apos;t be half
            so interesting if we know all about everything, would it? There&apos;d be no <b className="font-medium text-stone-800 dark:text-stone-200">scope for imagination</b> then, would there?
          </blockquote>
          <figcaption className="font-serif text-xs italic text-stone-500">- Anne of Green Gables, L. M. Montgomery</figcaption>
        </figure>
      </section>
    <main className="front-door flex-1">
      <div className="front-door-stage">
        <nav aria-label="Sections" className="front-door-plaques">
          {rooms.map(({ room, label, href, tagline }) => {
            const inside = (
              <>
                <span className={`front-door-picture front-door-picture--${room}`} aria-hidden="true">
                  {room === "science" && <DialogueArt />}
                  {room === "photography" && photo && <Image src={photo.src} alt="" fill sizes="(min-width: 640px) 26rem, 100vw" className="object-cover" />}
                </span>
                <span className="front-door-label">{label}</span>
                <span className="front-door-tagline-inline">{tagline}</span>
              </>
            );
            return room === "photography" && photographyUnderConstruction ? (
              <ConstructionPlaque key={room} href={href} className="front-door-plaque" room={room} section="Frame it Wright Photography">{inside}</ConstructionPlaque>
            ) : (
              <Link key={room} href={href} className="front-door-plaque" data-room={room}>{inside}</Link>
            );
          })}
        </nav>
        <div className="front-door-taglines" aria-hidden="true">
          {rooms.map(({ room, tagline }) => <span key={room} data-tagline={room}>{tagline}</span>)}
        </div>
      </div>
    </main>
    </>
  );
}
