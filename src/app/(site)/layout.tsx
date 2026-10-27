import type { Metadata } from "next";

import LiveVisualEditing from "@/components/live-visual-editing";
import { draftMode } from "next/headers";

import SiteChrome from "@/components/site-chrome";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "aaron wright | cognitive scientist, photographer, artist",
  description: "aaron wright - cognitive scientist, photographer, artist",
  metadataBase: new URL(siteUrl),
  // No title or description here: link previews take each page's own, not the home page's.
  openGraph: {
    images: [{ url: "/brand/og-image.jpg", width: 1200, height: 630, alt: "aaron wright: cognitive scientist, photographer, artist" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <SiteChrome>
            {children}
            {isDraftMode && <LiveVisualEditing />}
    </SiteChrome>
  );
}
