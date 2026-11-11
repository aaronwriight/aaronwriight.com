"use client";

import Link from "next/link";
import { useRef } from "react";

// A front-door plaque whose section is still being built: clicking it opens a small "under construction" card instead
// of going straight in, with a way to peek anyway. Without JavaScript it is an ordinary link.
export function ConstructionPlaque({
  href,
  className,
  room,
  section,
  children,
}: {
  href: string;
  className: string;
  room: string;
  section: string;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Link
        href={href}
        className={className}
        data-room={room}
        onClick={(event) => {
          if (!dialog.current) return;
          event.preventDefault();
          dialog.current.showModal();
        }}
      >
        {children}
      </Link>
      <dialog ref={dialog} aria-labelledby={`${room}-construction`} className="construction-card print-placard" onClick={(event) => event.target === dialog.current && dialog.current?.close()}>
        <p className="site-mono m-0 text-stone-500">under construction</p>
        <h2 id={`${room}-construction`} className="m-0 mt-3 font-serif text-2xl font-normal italic">{section} is still being built</h2>
        <p className="m-0 mt-3 font-serif text-base leading-relaxed text-stone-600 dark:text-stone-400">
          Photographs are going up and the last few pages are being written. Thanks for your patience: it&apos;s nearly there!
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={href} className="site-mono text-stone-900 underline underline-offset-4 dark:text-stone-100">have a peek anyway</Link>
          <button type="button" onClick={() => dialog.current?.close()} className="site-mono cursor-pointer text-stone-500 hover:text-olive">stay here</button>
        </div>
      </dialog>
    </>
  );
}
