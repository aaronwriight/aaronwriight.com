import Image from "next/image";
import Link from "next/link";
// Imported rather than referenced by path, so the size follows the files when scripts/brand_assets.py rebuilds them.
import dayLogo from "../../../public/brand/aaronwriight-logo.png";
import nightLogo from "../../../public/brand/aaronwriight-logo-night.png";

// The mark: a cup of coffee seen from above, its surface a contour map that folds like a brain, framed by a
// viewfinder. At night the cup dims and the marks around it switch to light ink, so it sits quietly on the dark paper.
export function Logo() {
  return (
    <Link href="/" aria-label="Home" className="block w-16 shrink-0 md:w-24">
      <Image src={dayLogo} alt="" className="h-auto w-full dark:hidden" priority />
      <Image src={nightLogo} alt="" className="hidden h-auto w-full dark:block" priority />
    </Link>
  );
}
