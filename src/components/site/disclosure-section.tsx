"use client";

import { useEffect, useRef } from "react";

export function DisclosureSection({ id, title, count, children }: {
  id: string;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const openAnchor = () => {
      const hash = window.location.hash.slice(1);
      if (hash === id || (id === "articles" && hash === "reading-list")) {
        if (ref.current) {
          ref.current.open = true;
          ref.current.scrollIntoView({ block: "start" });
        }
      }
    };
    openAnchor();
    window.addEventListener("hashchange", openAnchor);
    return () => window.removeEventListener("hashchange", openAnchor);
  }, [id]);

  return (
    <details ref={ref} id={id} className="group/disclosure scroll-mt-6 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f8200] [&::-webkit-details-marker]:hidden">
        <span className="flex items-baseline gap-3">
          <span className="font-serif text-base text-stone-900 dark:text-stone-100">{title}</span>
          {count !== undefined && <span className="text-xs text-stone-500">{count}</span>}
        </span>
        <span aria-hidden="true" className="text-lg text-stone-500 transition-transform group-open/disclosure:rotate-45">+</span>
      </summary>
      <div className="pb-3 pt-1 sm:pl-4">{children}</div>
    </details>
  );
}
