import Image from "next/image";
import Link from "next/link";

// The mark: a cup of coffee seen from above, its surface a contour map that folds like a brain, framed by a
// viewfinder. At night the corners and the focus dot switch to light ink and the cup dims, so it sits quietly on
// the dark paper.
export function Logo() {
  return (
    <Link href="/" aria-label="Home" className="block w-16 md:w-24">
      <Image src="/brand/aaronwriight-logo.png" alt="" width={640} height={570} className="h-auto w-full dark:hidden" priority />
      <Image src="/brand/aaronwriight-logo-night.png" alt="" width={640} height={570} className="hidden h-auto w-full dark:block" priority />
    </Link>
  );
}
