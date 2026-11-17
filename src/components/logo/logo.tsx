import Image from "next/image";
import { HomeLink } from "@/components/site/home-link";
// Imported rather than referenced by path, so the size follows the files when scripts/brand_assets.py rebuilds them.
import dayLogo from "../../../public/brand/aaronwriight-logo.png";
import nightLogo from "../../../public/brand/aaronwriight-logo-night.png";

// The mark: a cup of coffee seen from above, its surface a contour map that folds like a brain, framed by a
// viewfinder. At night the cup dims and the marks around it switch to light ink, so it sits quietly on the dark paper.
export function Logo({ className = "block w-16 shrink-0 md:w-24" }: { className?: string }) {
  return (
    <HomeLink label="Home" className={className}>
      <LogoImages />
    </HomeLink>
  );
}

// The mark alone, for a link of its own around it (Frame it Wright's top bar, where it leads to that site's home).
export function LogoMark({ className = "block w-12 shrink-0 md:w-14" }: { className?: string }) {
  return (
    <span className={className}>
      <LogoImages />
    </span>
  );
}

function LogoImages() {
  return (
    <>
      <Image src={dayLogo} alt="" className="h-auto w-full dark:hidden" priority />
      <Image src={nightLogo} alt="" className="hidden h-auto w-full dark:block" priority />
    </>
  );
}
