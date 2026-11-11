import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";

// Cormorant Garamond, the free face closest to Perpetua (the intended face, which has no web licence here). Next
// downloads it at build time and serves it from this site, so browsers never contact Google. Variable weight 300-700.
export const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// IBM Plex Mono for the retro details: date stamps, frame numbers, small labels. Weights 400 and 500.
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
