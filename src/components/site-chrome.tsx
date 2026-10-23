import "./globals.css";
import { Logo } from "@/components/logo/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { TopoBackground } from "@/components/site/topo-background";
import { serif } from "@/lib/fonts";
import { SITE_THEME_STORAGE_KEY } from "@/lib/site-theme";
import Link from "next/link";

/* LINE 24 IS THE SITE LOGO */

const themeInitializationScript = `
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
    <html lang="en" className={`scroll-smooth ${serif.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-serif font-normal text-sm text-stone-900 lining-nums dark:bg-stone-950 dark:text-stone-100">
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <TopoBackground />
        <div className="flex min-h-screen flex-col gap-4">
          <header className="container m-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 px-6 py-10 md:pt-20">
            <div className="flex flex-col">
              <span className="font-serif text-sm lowercase tracking-widest">
                aaron wright
              </span>
              <span className="text-xs font-serif text-stone-500 lowercase tracking-wider mt-1">
                cognitive scientist, photographer, artist
              </span>
            </div>
            <Logo />
          </header>

          {children}

          <footer className="container mx-auto flex justify-between gap-4 px-6 py-20 text-stone-500">
            <div className="flex items-center gap-2 leading-none">
              <Link href="/about" className="leading-none text-stone-500">
                wiki
              </Link>
              <span aria-hidden="true" className="leading-none text-stone-400">•</span>
              <ThemeToggle />
            </div>
            <span className="text-stone-500">© {new Date().getFullYear()} Aaron Wright</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
