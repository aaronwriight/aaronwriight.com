import type { Metadata } from "next";
import Link from "next/link";
import { Kudos } from "@/components/photography/kudos";
import { PrintPhoto } from "@/components/photography/print-photo";
import { ContactForms } from "@/components/photography/contact-forms";
import { instagramUrl, kudos, photographyFaq, photoPath } from "@/data/photography";
import { chosenPhotos, isUpright, pickPhotos } from "@/lib/photography";

export const metadata: Metadata = {
  title: "contact",
  description: "Create with me! Start a conversation about the moments, people, and ideas you would love to photograph.",
  alternates: { canonical: "/contact" },
};

// Contact doubles as booking: the invitation, then the forms (booking a session, or a general question at #general),
// photographs from the sessions down the side in two staggered columns (content/photography/home.json), then kudos and
// the FAQ. ?session=<slug> preselects a session in the booking form.
export default function PhotographyContactPage() {
  const side = chosenPhotos.contact.length > 0 ? chosenPhotos.contact : pickPhotos(6, new Set(), isUpright);
  const columns = [side.filter((_, index) => index % 2 === 0), side.filter((_, index) => index % 2 === 1)];

  return (
    <>
      <div className="fiw-wrap grid gap-12 pt-12 pb-16 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
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
          <section id="general" aria-labelledby="inquiry-heading" className="max-w-2xl scroll-mt-8 border border-stone-300 bg-band p-6 sm:p-8 dark:border-stone-700">
            <h2 id="inquiry-heading" className="fiw-title m-0 mb-3 text-[2rem]">start a conversation</h2>
            <p className="m-0 mb-7 text-sm leading-6">
              Reach out <a href="mailto:frameitwright@gmail.com" className="fiw-link">frameitwright@gmail.com</a> directly, send a message on <a href={instagramUrl} className="fiw-link">Instagram</a>, or prepare a draft below!
            </p>
            <ContactForms />
          </section>
          <p className="m-0 max-w-2xl text-xs leading-6 text-stone-600 dark:text-stone-400">
            Just following along? The <Link href={photoPath("/newsletter")} className="fiw-link">newsletter</Link> is an occasional email with new photographs and open dates.
            Sending an inquiry doesn&apos;t sign you up for it.
          </p>
        </div>
        <div aria-hidden="true" className="hidden grid-cols-2 content-start gap-5 pt-24 lg:grid">
          {columns.map((column, index) => (
            <div key={index} className={`grid content-start gap-5${index === 1 ? " pt-24" : ""}`}>
              {column.map((photo) => (
                <PrintPhoto key={photo.src} photo={photo} ratio="4 / 5" sizes="(min-width: 1024px) 22vw, 0px" />
              ))}
            </div>
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
