import Link from "next/link";

import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import { siteUrl } from "@/lib/site-url";
export const metadata: Metadata = {
  title: "Page not found | aaron wright",
  description: "",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "404 | aaron wright",
    description: "",
    images: ["/sand_dollar.png"],
    authors: ["https://aaronwriight.github.io"],
  },
};

export default function NotFound() {
  return (
    <SiteChrome>
      <main className="grid-cols-auto container mx-auto grid flex-1 snap-proximity items-center gap-8 px-6">
        <div>
          <h1 className="m-0 text-sm font-medium antialiased">
            You really are lost.
          </h1>
          <p className="m-0 mt-2 text-sm  antialiased">
            Return <Link href="/"><u>home</u></Link>.
          </p>
        </div>
      </main>
    </SiteChrome>
  );
}
