import "./globals.css";
import { Logo } from "@/components/logo/logo";
import { SiteNav } from "@/components/site/site-bars";
import { HomeLink } from "@/components/site/home-link";
import { SiteFooterLinks } from "@/components/site/footer-links";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { TopoBackground } from "@/components/site/topo-background";
import { mono, serif } from "@/lib/fonts";
import { SITE_THEME_STORAGE_KEY } from "@/lib/site-theme";
import Link from "next/link";

/* THE SITE LOGO IS <Logo /> IN THE HEADER BELOW */

// Applies the saved theme before first paint. Shared with the photography layout.
export const themeInitializationScript = `
  (function () {
    var root = document.documentElement;
    try {
      var theme = window.localStorage.getItem(${JSON.stringify(SITE_THEME_STORAGE_KEY)});
      var isDark = theme === "dark";
      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
    } catch (error) {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  })();
`;

export default function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-paper font-serif font-normal text-sm text-stone-900 lining-nums dark:text-stone-100">
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <TopoBackground />
        <div className="flex min-h-screen flex-col">
          {/* The site bar, after Frame it Wright Photography's: the mark and name on the left, the worlds on the right. */}
          <header className="site-bar">
            <div className="site-wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
              <div className="flex items-center gap-3">
                <Logo className="block w-12 shrink-0 md:w-14" />
                <HomeLink className="flex flex-col leading-none hover:no-underline">
                  <span className="font-serif text-base lowercase tracking-widest text-stone-900 dark:text-stone-100">aaron wright</span>
                  <span className="mt-1.5 font-serif text-xs lowercase tracking-wider text-stone-500">cognitive scientist, photographer, artist</span>
                </HomeLink>
              </div>
              <SiteNav />
            </div>
          </header>

          {children}

          {/* Footers on both sites follow one plan: on the left the site's link, a small grey symbol (GitHub here,
              Instagram on photography) and the night switch; on the right the copyright, where the name leads home to
              aaronwriight.com. */}
          <footer className="site-footer">
            <div className="site-wrap footer-row py-8 text-stone-500">
              <SiteFooterLinks>
                <ThemeToggle />
              </SiteFooterLinks>
              <span className="site-mono footer-end">© {new Date().getFullYear()} <HomeLink className="text-stone-500">Aaron Wright</HomeLink></span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
