import { Cormorant_Garamond } from "next/font/google";

// Cormorant Garamond, the free face closest to Perpetua (the intended face, which has no web licence here). Next
// downloads it at build time and serves it from this site, so browsers never contact Google. Variable weight 300-700.
export const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
