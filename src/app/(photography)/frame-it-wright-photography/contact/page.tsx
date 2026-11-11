import type { Metadata } from "next";
import Link from "next/link";
import { Kudos } from "@/components/photography/kudos";
import { PrintPhoto } from "@/components/photography/print-photo";
import { BookingInquiry } from "@/components/site/booking-inquiry";
import { instagramUrl, kudos, photographyFaq, photoPath } from "@/data/photography";
import { isUpright, isWide, pickPhotos } from "@/lib/photography";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "contact",
  description: "Create with me! Start a conversation about the moments, people, and ideas you would love to photograph.",
  alternates: { canonical: "/contact" },
};

// Contact doubles as booking: the invitation and the inquiry form, photographs set out of line down the side, then
// kudos and the FAQ. ?session=<slug> preselects a session in the form.
export default function PhotographyContactPage() {
  const used = new Set<string>();
  const side = [...pickPhotos(1, used, isUpright), ...pickPhotos(1, used, isWide), ...pickPhotos(1, used, isUpright)];
  const tilts = ["md:rotate-[2deg]", "md:-rotate-[2.5deg] md:-ml-8 md:w-[115%]", "md:rotate-[1.5deg] md:ml-10 md:w-[80%]"];
  const ratios = ["4 / 5", "3 / 2", "2 / 3"];

  return (
    <>
      <div className="fiw-wrap grid gap-12 pt-12 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] lg:gap-20">
        <div className="grid content-start gap-10">
          <header className="grid gap-4">
            <span className="fiw-eyebrow">contact</span>
            <h1 className="fiw-title m-0 text-[clamp(2.8rem,6vw,4.4rem)]">Create with me!</h1>
          </header>
          <div className="grid max-w-2xl gap-5 text-lg leading-relaxed">
            <p className="m-0">
              Celebrating a milestone or special moment? Looking for an excuse to get your friends together? Have a portrait session, family gathering, creative collaboration, or something else in mind? Tell me a little about it!
            </p>
            <p className="m-0">
              A location, a rough date or season, and a few words about your idea are a great place to start! We can discuss availability, scope, pricing, and delivery by email or phone before making arrangements –– for now, just dream!
            </p>
            <p className="m-0">What would your <em>perfect</em> shoot look like?</p>
            <p className="m-0">An inquiry isn&apos;t a commitment –– it simply helps me start thinking about how to capture what matters to you!</p>
            <p className="m-0">
              ... and while you&apos;re at it, tell me a little about yourself! A great photo is one thing; a great experience is another. The better I get to know who I&apos;m working with, the more natural I&apos;m able to help you feel, and the more we can make your photos <em>your</em> photos.
            </p>
            <p className="m-0">
              To help bridge the gap, you can read a little <Link href={photoPath("/about")} className="fiw-link">about me</Link> here! :)
            </p>
          </div>
          <section aria-labelledby="inquiry-heading" className="max-w-2xl rounded-[3px] border border-stone-300 bg-white p-6 sm:p-8 dark:border-stone-700 dark:bg-paper-tint">
            <h2 id="inquiry-heading" className="fiw-title m-0 mb-3 text-[2rem]">start a conversation</h2>
            <p className="m-0 mb-7 text-sm leading-6">
              Reach out <a href="mailto:frameitwright@gmail.com" className="fiw-link">frameitwright@gmail.com</a> directly, send a message on <a href={instagramUrl} className="fiw-link">Instagram</a>, or prepare a draft below!
            </p>
            <BookingInquiry />
          </section>
          <p className="m-0 max-w-2xl text-xs leading-6 text-stone-600 dark:text-stone-400">
            Following along? The <a href={`${siteUrl}/creative/mailing-list`} className="fiw-link">creative mailing list</a> is for occasional writing and creative updates.
            Booking inquiries do not subscribe you to it.
          </p>
        </div>
        <div aria-hidden="true" className="hidden content-start gap-10 pt-24 lg:grid">
          {side.map((photo, index) => (
            <PrintPhoto key={photo.src} photo={photo} ratio={ratios[index]} sizes="30vw" className={tilts[index]} />
          ))}
        </div>
      </div>

      <div className="fiw-band py-16">
        <div className="fiw-wrap max-w-4xl">
          <Kudos notes={kudos} />
        </div>
      </div>

      <section aria-labelledby="faq-heading" className="fiw-wrap grid max-w-3xl gap-6 py-16">
        <h2 id="faq-heading" className="fiw-title m-0 text-[2.4rem]">questions</h2>
        <div className="fiw-faq">
          {photographyFaq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p className="m-0 mt-3 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-400">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="m-0 text-stone-600 dark:text-stone-400">
          Had a session already? <Link href={photoPath("/galleries")} className="fiw-link">find your photos</Link>
        </p>
      </section>
    </>
  );
}
