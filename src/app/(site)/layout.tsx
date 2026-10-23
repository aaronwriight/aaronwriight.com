import type { Metadata } from "next";

import LiveVisualEditing from "@/components/live-visual-editing";
import { draftMode } from "next/headers";

import SiteChrome from "@/components/site-chrome";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "aaron wright | cognitive scientist, photographer, artist",
  description: "aaron wright - cognitive scientist, photographer, artist",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "aaron wright | cognitive scientist, photographer, artist",
    description: "aaron wright - cognitive scientist, photographer, artist",
    images: [{ url: "/brand/og-image.jpg", width: 1200, height: 630, alt: "aaron wright: cognitive scientist, photographer, artist" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "aaron wright | cognitive scientist, photographer, artist",
    description: "aaron wright - cognitive scientist, photographer, artist",
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
