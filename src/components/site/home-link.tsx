"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A link home that is not a link on the home page itself (the logo and the name in the site bar).
export function HomeLink({ className, label, children }: { className?: string; label?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return <span className={className}>{children}</span>;
  return (
    <Link href="/" aria-label={label} className={className}>
      {children}
    </Link>
  );
}
