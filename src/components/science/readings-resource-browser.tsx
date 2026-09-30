"use client";

import { useState } from "react";
import { ExternalLink } from "@/components/science/science-content";
import { DisclosureSection } from "@/components/site/disclosure-section";
import { readings, readingTags, resourceSections } from "@/data/readings-resources";

const sortedReadings = [...readings].sort((a, b) => a.title.localeCompare(b.title));
const filterClass = "inline-flex min-h-8 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-sm border px-2 py-1 font-serif text-xs leading-none transition-colors hover:border-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
const filters = [["all", "All", "var(--site-text-primary)"], ["favorites", "★ Favorites", "var(--site-text-primary)"], ...readingTags.map(([tag, color]) => [tag, tag, color])];

export function ReadingsResourceBrowser() {
  const [activeTag, setActiveTag] = useState("all");
  const visibleReadings = sortedReadings.filter((reading) => {
    if (activeTag === "all") return true;
    if (activeTag === "favorites") return reading.favorite;
    return reading.tags.includes(activeTag);
  });

  function toggleTag(tag: string) {
    setActiveTag((current) => (current === tag ? "all" : tag));
  }

  return (
    <div className="divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
      <DisclosureSection id="articles" title="Articles" count={readings.length}>
          <p>Articles and scholars that have captured my attention, challenged my scientific convictions, shaped my understanding, and inspired my favorite discussions.</p>
          <p className="text-xs text-stone-500">Filter by topic, or explore a few favorites. ★ marks a favorite.</p>
          <div className="not-prose flex items-center gap-2 overflow-x-auto py-1" role="group" aria-label="Filter articles">
            {filters.map(([tag, label, color]) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={activeTag === tag}
                aria-controls="reading-results"
                className={`${filterClass} border-stone-200 dark:border-stone-700`}
                style={{ color, ...(activeTag === tag ? { borderColor: color, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` } : {}) }}
              >
                {label}
              </button>
            ))}
          </div>
          <p role="status" className="mb-0 text-xs text-stone-500">{visibleReadings.length} {visibleReadings.length === 1 ? "article" : "articles"}</p>
          <ul id="reading-results" className="mt-3 space-y-4">
            {visibleReadings.map((reading) => (
              <li key={reading.href}>
                {reading.favorite && <><span aria-label="Favorite">★</span>{" "}</>}{reading.title}{" "}
                {reading.tags.map((tag) => (
                  <span key={tag} title={tag} aria-label={tag} style={{ color: readingTags.find(([label]) => label === tag)?.[1] }}>›</span>
                ))}{" "}
                <span className="whitespace-nowrap">[<ExternalLink href={reading.href}>§<span className="sr-only"> {reading.title}</span></ExternalLink>]</span>
                {reading.companion && <>{" "}[<ExternalLink href={reading.companion.href}>{reading.companion.label}</ExternalLink>]</>}
              </li>
            ))}
          </ul>
      </DisclosureSection>

      {resourceSections.map((section) => (
        <DisclosureSection key={section.id} id={section.id} title={section.title} count={section.resources.length}>
            <p>{section.introduction}</p>
            <ul className="space-y-3">
              {section.resources.map((resource) => (
                <li key={resource.href}>
                  <ExternalLink href={resource.href}>{resource.name}</ExternalLink>
                  <span className="mt-1 block text-stone-500">{resource.description}</span>
                </li>
              ))}
            </ul>
        </DisclosureSection>
      ))}
    </div>
  );
}
