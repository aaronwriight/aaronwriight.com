import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "contact",
  description: "Contact Aaron Wright",
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
};

export default function ContactPage() {
  return (
    <ContactShell title="contact" showTitle={false}>
      <div className="not-prose flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
        <Image
          src="/images/pfp/pfp6_2025_mit_sq.jpg"
          alt="Aaron Wright"
          width={144}
          height={144}
          className="h-36 w-36 rounded-sm object-cover"
          priority
        />
        <div className="min-w-0 space-y-3 leading-relaxed sm:-translate-y-1">
          <p className="font-serif text-sm lowercase tracking-widest text-stone-900 dark:text-stone-100">aaron wright</p>
          <p className="text-xs text-stone-500">cognitive scientist, artist</p>
          <p className="text-xs leading-6 tracking-wider text-stone-450">
            cambridge, ma / providence, ri
          </p>
          <p className="text-xs lowercase tracking-wider">
            <Link
              href="/files/cv/WrightAaron_cv_2026_current.pdf?v=2026-09-12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6f8200]"
            >
              cv
            </Link>{" "}
            <span className="text-stone-400">|</span>{" "}
            <Link href="/resume" className="text-[#6f8200]">resume</Link>
          </p>
        </div>
      </div>

      <p className="max-w-3xl text-stone-900 dark:text-stone-100">
        You can learn more about me and the work I do in a variety of places on this site or elsewhere. Feel free to reach out about my communities,
        my research, creative efforts, or just to have a chat! Looking forward to connecting! :)
      </p>

      <div className="not-prose grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="science-contact" className="contact-placard min-w-0 border border-stone-300 p-5 sm:p-6 dark:border-stone-700">
          <h2 id="science-contact" className="font-serif text-[1.4rem] font-normal lowercase leading-tight text-stone-900 dark:text-stone-100">science</h2>

          <div className="mt-5 space-y-2">
            <p className="font-serif text-sm text-stone-900 dark:text-stone-100">
              Lab Manager @ Brown Cognitive &amp; Psychological Sciences {"{PEAC lab}"} 🧠
            </p>
          </div>

          <p className="mt-5 text-xs leading-6 text-stone-500">Research questions, collaborations, mentorship, talks, and academic life.</p>
          <p className="mt-5 font-serif text-sm">
            <Link href="mailto:aaron_wright@brown.edu" className="text-[#6f8200]">aaron_wright@brown.edu</Link>
          </p>
          <nav aria-label="Science contact links" className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-xs tracking-wider">
            <Link href="https://fpetzschner.com/lab/" className="text-[#6f8200]">PEAC lab</Link>
            <Link href="https://github.com/aaronwriight" className="text-[#6f8200]">github</Link>
            <Link href="https://scholar.google.com/citations?user=2b1N4FcAAAAJ&hl=en" className="text-[#6f8200]">google scholar</Link>
            <Link href="https://orcid.org/0009-0003-2532-2866" className="text-[#6f8200]">orcid</Link>
            <Link href="https://www.linkedin.com/in/aaron-wriight" className="text-[#6f8200]">linkedin</Link>
            <Link href="https://bsky.app/profile/aaronwriight.bsky.social" className="text-[#6f8200]">bluesky</Link>
          </nav>
        </section>

        <section aria-labelledby="creative-contact" className="contact-placard min-w-0 border border-stone-300 p-5 sm:p-6 dark:border-stone-700">
          <h2 id="creative-contact" className="font-serif text-[1.4rem] font-normal lowercase leading-tight text-stone-900 dark:text-stone-100">photography &amp; creative</h2>
          <p className="mt-5 font-serif text-sm text-stone-900 dark:text-stone-100">frame it wright photography, scope for imagination</p>
          <p className="mt-5 text-xs leading-6 text-stone-500">Photography, bookings, creative collaborations, and other musings.</p>
          <div className="mt-5 space-y-1 font-serif text-sm">
            <p><Link href="mailto:aaron.anthonyva@gmail.com" className="text-[#6f8200]">aaron.anthonyva@gmail.com</Link></p>
            <p><Link href="mailto:frameitwright@gmail.com" className="text-[#6f8200]">frameitwright@gmail.com</Link></p>
          </div>
          <nav aria-label="Creative contact links" className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-xs lowercase tracking-wider">
            <Link href="https://www.instagram.com/frameitwrightphotography/" className="text-[#6f8200]">instagram</Link>
            <Link href="https://www.buymeacoffee.com/aaronwriight" className="text-[#6f8200]">buy me a coffee ;)</Link>
            <Link href="/frame-it-wright-photography/mailing-list" className="text-[#6f8200]">mailing list</Link>
          </nav>
        </section>
      </div>
    </ContactShell>
  );
}
