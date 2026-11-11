"use client";

import { useState } from "react";

type Note = { quote: string; by: string; session: string };

// Kudos from clients, one at a time, with previous and next buttons.
export function Kudos({ notes }: { notes: Note[] }) {
  const [index, setIndex] = useState(0);
  if (!notes.length) return null;
  const note = notes[index];
  const step = (offset: number) => setIndex((index + offset + notes.length) % notes.length);
  const button = "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-stone-400 text-lg leading-none hover:border-wright hover:text-wright dark:border-stone-600";
  return (
    <section aria-roledescription="carousel" aria-label="Kudos" className="grid gap-6">
      <span className="fiw-eyebrow text-center">kudos</span>
      <div className="flex items-center gap-4 sm:gap-8">
        <button type="button" onClick={() => step(-1)} aria-label="Previous kudos" className={button}>‹</button>
        <figure aria-live="polite" className="m-0 flex-1 text-center">
          <blockquote className="fiw-note m-0">“{note.quote}”</blockquote>
          <figcaption className="fiw-mono mt-4 text-stone-500">{note.by} · {note.session}</figcaption>
        </figure>
        <button type="button" onClick={() => step(1)} aria-label="Next kudos" className={button}>›</button>
      </div>
      <p className="fiw-mono m-0 text-center text-stone-400" aria-hidden="true">{index + 1} / {notes.length}</p>
    </section>
  );
}
