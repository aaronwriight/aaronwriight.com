"use client";

import { useEffect } from "react";

// A journal entry (header and text) inside a reading panel. Not yet decided (November 2026): by default the entry sits
// straight on the paper, contours and all; ?reading=panel previews it on a flat panel in the footer's warm white that
// hides the contours, and ?reading=print previews the same panel as a print. See .reading-panel in globals.css.
export function ReadingPanel({ children, className = "w-full" }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    const choice = new URLSearchParams(window.location.search).get("reading");
    if (choice === "panel" || choice === "print") document.documentElement.dataset.reading = choice;
    return () => {
      delete document.documentElement.dataset.reading;
    };
  }, []);
  return <div className={`reading-panel ${className}`}>{children}</div>;
}
