"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/data/navigation";

// The top bars (November 2026), after Frame it Wright Photography's: the site bar names the three worlds and contact,
// and each section adds a bar of its own with its pages, sub-pages as drop-downs. They replace the side menu.

const within = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);
const pathOf = (href: string) => href.split("#")[0];

const worlds = [
  { label: "science", href: "/cognitive-science", prefixes: ["/cognitive-science"] },
  { label: "photography", href: "/frame-it-wright-photography", prefixes: ["/frame-it-wright-photography"] },
  { label: "creative", href: "/creative", prefixes: ["/creative", "/venture", "/scope-for-imagination", "/literature", "/stories-and-guides", "/personal"] },
  { label: "contact", href: "/contact", prefixes: ["/contact"] },
];

export function SiteNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Site" className="site-nav">
      <ul>
        {worlds.map(({ label, href, prefixes }) => (
          <li key={href}>
            <Link href={href} aria-current={prefixes.some((prefix) => within(pathname, prefix)) ? "page" : undefined}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// A page of the section is current when it is this page, or (for pages other than the section's home) when this page
// sits under it; an item with sub-pages is current when one of them is.
function isCurrent(item: NavigationItem, pathname: string, sectionHref: string): boolean {
  const path = pathOf(item.href);
  if (pathname === path) return true;
  if (path !== sectionHref && within(pathname, path)) return true;
  return (item.children ?? []).some((child) => isCurrent(child, pathname, sectionHref));
}

// A drop-down lists a page's sub-pages only; links to blocks within the page itself (#research-overview, the
// resources page's sections) stay off it.
const pages = (item: NavigationItem) => (item.children ?? []).filter((child) => !child.href.includes("#"));

export function SectionBar({
  section,
  href,
  links,
  parent,
  trail,
  current,
}: {
  section: string;
  href: string;
  links: NavigationItem[];
  parent?: [string, string];
  trail?: [string, string];
  current?: string;
}) {
  const pathname = usePathname() ?? "";
  // The page you are on ends the path, unless it is the section's own page (its name already says so) or the page
  // one level up already has its name.
  // An "about" page is the section's own page, so it shows the section's name alone.
  const here = current && current !== "about" && pathname !== href && current !== trail?.[0] && current !== section ? current : undefined;
  return (
    <div className="site-bar site-section-bar">
      <div className="site-wrap flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-4">
        <p className="site-section-name m-0">
          {parent && (
            <>
              <Link href={parent[1]} className="site-crumb">{parent[0]}</Link>
              <span className="site-crumb-rule" aria-hidden="true">/</span>
            </>
          )}
          {/* The page you are on is the large italic; everything before it is a small crumb. */}
          <Link href={href} className={here ? "site-crumb" : undefined}>{section}</Link>
          {trail && (
            <>
              <span className="site-crumb-rule" aria-hidden="true">/</span>
              <Link href={trail[1]} className="site-crumb">{trail[0]}</Link>
            </>
          )}
          {here && (
            <>
              <span className="site-crumb-rule" aria-hidden="true">/</span>
              <span className="site-crumb-current" aria-current="page">{here}</span>
            </>
          )}
        </p>
        {links.length > 0 && (
          <nav aria-label={`${section} pages`} className="site-nav">
            <ul>
              {links.map((item) => (
                <li key={item.href} className={pages(item).length ? "site-nav-item has-drop" : "site-nav-item"}>
                  <Link href={item.href} aria-current={isCurrent(item, pathname, href) ? "page" : undefined}>
                    {item.label}
                    {pages(item).length ? <span className="site-nav-caret" aria-hidden="true">▾</span> : null}
                  </Link>
                  {pages(item).length ? (
                    <ul className="site-nav-drop">
                      {pages(item).map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} aria-current={pathname === pathOf(child.href) && !child.href.includes("#") ? "page" : undefined}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
