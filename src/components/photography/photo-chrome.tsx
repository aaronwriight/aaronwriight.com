import Link from "next/link";
import { PhotoNav } from "@/components/photography/photo-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { InstagramIcon } from "@/components/site/footer-links";
import { instagramUrl, photoPath } from "@/data/photography";
import { siteUrl } from "@/lib/site-url";

// The name, with the last name in golden hour.
export function FrameItWright({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Frame it <span className="fiw-w">Wright</span> Photography
    </span>
  );
}

// Frame it Wright Photography's own top bar and footer, in place of the main site's side menu and contour map.
export function PhotoChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="fiw flex min-h-screen flex-col">
      <header className="fiw-bar">
        <div className="fiw-wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
          <Link href={photoPath()} className="text-[1.45rem] italic leading-none hover:no-underline">
            <FrameItWright />
          </Link>
          <PhotoNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="site-footer">
        <div className="fiw-wrap footer-row py-8 text-stone-500">
          {/* The same plan as the main site's footer: the name, Instagram and the night switch on the left; the copyright
              on the right, where the name leads back to aaronwriight.com. */}
          <div className="flex items-center gap-2 leading-none">
            <span className="fiw-mono lowercase">frame it wright photography</span>
            <span aria-hidden="true" className="text-stone-400">•</span>
            <a href={instagramUrl} aria-label="Instagram" title="Instagram" className="footer-icon">
              <InstagramIcon />
            </a>
            <span aria-hidden="true" className="text-stone-400">•</span>
            <ThemeToggle />
          </div>
          <span className="fiw-mono footer-end">© {new Date().getFullYear()} <a href={siteUrl} className="text-stone-500">Aaron Wright</a></span>
        </div>
      </footer>
    </div>
  );
}
