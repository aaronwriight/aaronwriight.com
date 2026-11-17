import type { Metadata } from "next";
// Imported rather than referenced by path, so each icon's address carries a fingerprint of its contents: when
// scripts/brand_assets.py redraws them, browsers fetch the new ones instead of keeping a cached old mark.
import favicon from "../../public/favicon.ico";
import icon32 from "../../public/brand/icon-32.png";
import icon192 from "../../public/brand/icon-192.png";
import appleIcon from "../../public/brand/apple-touch-icon.png";

// Icons for every page, the 404 page and the studio included.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: favicon.src, sizes: "any" },
      { url: icon32.src, type: "image/png", sizes: "32x32" },
      { url: icon192.src, type: "image/png", sizes: "192x192" },
    ],
    apple: appleIcon.src,
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
