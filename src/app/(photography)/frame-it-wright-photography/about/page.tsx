import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CreateWithMe } from "@/components/photography/create-with-me";
import { PrintPhoto } from "@/components/photography/print-photo";
import { photoPath } from "@/data/photography";
import { isUpright, isWide, pickPhotos } from "@/lib/photography";

export const metadata: Metadata = {
  title: "about",
  description: "Aaron Wright, the photographer behind Frame it Wright Photography.",
  alternates: { canonical: "/about" },
};

// About: Aaron's portrait beside the opening, then the story with a few photographs set out of line between paragraphs.
// The portrait (_DSC0050-2.jpg) stands in until a new one is chosen.
export default function PhotographyAboutPage() {
  const used = new Set<string>();
  const [wide] = pickPhotos(1, used, isWide);
  const [upright] = pickPhotos(1, used, isUpright);
  const [last] = pickPhotos(1, used, isWide);

  return (
    <>
      <section className="fiw-wrap grid items-center gap-10 pt-12 pb-14 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] md:gap-16">
        <span className="print" style={{ aspectRatio: "1339 / 2048" }}>
          <Image src="/images/photography/about/aaron-wright.jpg" alt="Aaron Wright" fill priority sizes="(min-width: 768px) 36vw, 100vw" className="object-cover" />
        </span>
        <div className="grid gap-5">
          <span className="fiw-eyebrow">about</span>
          <h1 className="fiw-title m-0 text-[clamp(2.8rem,6vw,4.2rem)]">Hi! I&apos;m Aaron.</h1>
          <p className="m-0 max-w-xl text-lg leading-relaxed">
            [Your opening: who you are, where you&apos;re based, and what you love to photograph.]
          </p>
          <p className="m-0 max-w-xl text-lg leading-relaxed">
            [Why photography: how a cognitive scientist ends up behind the camera, and what you notice in people.]
          </p>
        </div>
      </section>

      {wide && (
        <div className="fiw-wrap grid grid-cols-12">
          <PrintPhoto photo={wide} ratio="3 / 2" sizes="(min-width: 768px) 55vw, 90vw" className="col-span-11 col-start-2 md:col-span-7 md:col-start-5" />
        </div>
      )}

      <section aria-labelledby="how-i-work" className="fiw-wrap grid items-start gap-10 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] md:gap-16">
        <div className="grid gap-5">
          <h2 id="how-i-work" className="fiw-title m-0 text-[2.4rem]">How I work</h2>
          <p className="m-0 max-w-xl text-lg leading-relaxed">
            [What a session with you feels like: how you plan it together, how you guide people in front of the camera, and what happens after.]
          </p>
          <p className="m-0 max-w-xl text-lg leading-relaxed">
            Want to know more first? <Link href={photoPath("/contact")} className="fiw-link">Ask me anything</Link>.
          </p>
        </div>
        {upright && <PrintPhoto photo={upright} ratio="4 / 5" sizes="(min-width: 768px) 30vw, 70vw" className="w-3/4 justify-self-end md:mt-16 md:w-full" />}
      </section>

      {last && (
        <div className="fiw-wrap grid grid-cols-12">
          <PrintPhoto photo={last} ratio="16 / 10" sizes="(min-width: 768px) 50vw, 90vw" className="col-span-11 md:col-span-6 md:col-start-2" />
        </div>
      )}

      <CreateWithMe />
    </>
  );
}
