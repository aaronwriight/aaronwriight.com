import type { Metadata } from "next";
import { PhotoChrome } from "@/components/photography/photo-chrome";
import { photographyUnderConstruction } from "@/data/photography";
import { themeInitializationScript } from "@/components/site-chrome";
import { mono, serif } from "@/lib/fonts";
import "@/components/globals.css";

// Frame it Wright Photography is its own site at frameitwright.com (next.config.mjs serves this section there), so
// canonical links and previews use that address. Page canonicals are written without the section prefix.
export const metadata: Metadata = {
  metadataBase: new URL("https://frameitwright.com"),
  title: { default: "Frame it Wright Photography", template: "%s | Frame it Wright Photography" },
  description: "Weddings, couples, families, graduates, and portraits, photographed by Aaron Wright.",
  openGraph: { siteName: "Frame it Wright Photography", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function PhotographyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-paper font-serif font-normal text-stone-900 lining-nums dark:text-stone-100">
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        {photographyUnderConstruction ? (
          <main className="fiw grid min-h-screen place-items-center px-4 py-16">{children}</main>
        ) : (
          <PhotoChrome>{children}</PhotoChrome>
        )}
      </body>
    </html>
  );
}
