"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { photographyNav } from "@/data/photography";

// On frameitwright.com the path has no /frame-it-wright-photography prefix, so the current page is matched on the
// part after it.
const bare = (path: string) => path.replace(/^\/frame-it-wright-photography/, "") || "/";

export function PhotoNav() {
  const pathname = bare(usePathname() ?? "");
  return (
    <nav aria-label="Frame it Wright Photography" className="fiw-nav flex flex-wrap gap-x-6 gap-y-2">
      {photographyNav.map(({ label, href }) => {
        const target = bare(href);
        const current = pathname === target || pathname.startsWith(`${target}/`);
        return (
          <Link key={href} href={href} aria-current={current ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
