"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type BackdropSession = {
  slug: string;
  title: string;
  href: string;
  count: number;
  cover?: { src: string; alt: string };
};

// The portfolio: the whole page wears one photograph from the session you point at (or focus), crossfading as you
// move; five plaques along the bottom open each session's gallery. Without hover (phones), a tap goes straight in.
export function PortfolioBackdrop({ sessions }: { sessions: BackdropSession[] }) {
  const [on, setOn] = useState(sessions.find((session) => session.cover)?.slug ?? sessions[0]?.slug);
  const current = sessions.find((session) => session.slug === on);

  return (
    <section aria-labelledby="portfolio-title" className="fiw-folio">
      {sessions.map((session, index) =>
        session.cover ? (
          <div key={session.slug} className="fiw-folio-layer" data-on={session.slug === on} aria-hidden={session.slug !== on}>
            <Image src={session.cover.src} alt={session.slug === on ? session.cover.alt : ""} fill priority={index === 0} sizes="100vw" className="object-cover" />
          </div>
        ) : (
          <div key={session.slug} className="fiw-folio-layer fiw-folio-layer--empty" data-on={session.slug === on} aria-hidden="true" />
        ),
      )}
      <div className="fiw-wrap grid content-between gap-10 py-8 md:py-10">
        <div className="fiw-folio-head flex flex-wrap items-baseline justify-between gap-3">
          <h1 id="portfolio-title" className="fiw-title m-0 text-[clamp(2.8rem,6vw,4.4rem)] text-white">portfolio</h1>
          <span className="fiw-mono" aria-live="polite">
            {current ? `${current.title} · ${current.count ? `${current.count} photos` : "to come"}` : ""}
          </span>
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-5">
          {sessions.map((session, index) => (
            <li key={session.slug} className={index === sessions.length - 1 ? "col-span-2 md:col-span-1" : undefined}>
              <Link
                href={session.href}
                className="fiw-plaque h-full"
                data-on={session.slug === on}
                onPointerEnter={() => setOn(session.slug)}
                onFocus={() => setOn(session.slug)}
              >
                <span className="fiw-mono">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-[1.35rem] italic leading-tight">{session.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
