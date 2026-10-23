import type { Metadata } from "next";
import Link from "next/link";
import { BookingInquiry } from "@/components/site/booking-inquiry";
import { PhotographyShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "photography booking",
  description: "Create with me! Start a conversation about the moments, people, and ideas you would love to photograph.",
  alternates: { canonical: "/frame-it-wright-photography/booking" },
};

export default function PhotographyBookingPage() {
  return (
    <PhotographyShell title="booking" subtitle={<span className="inline-block normal-case">Create with me!</span>}>
      <div className="max-w-2xl space-y-5">
        <p>
          Celebrating a milestone or special moment? Looking for an excuse to get your friends together? Have a portrait session, family gathering, creative collaboration, or something else in mind? Tell me a little about it!
        </p>
        <p>
          A location, a rough date or season, and a few words about your idea are a great place to start! We can discuss availability, scope, pricing, and delivery by email or phone before making arrangements –– for now, just dream!
        </p>
        <p>What would your <em>perfect</em> shoot look like?</p>
        <p>An inquiry isn&apos;t a commitment –– it simply helps me start thinking about how to capture what matters to you!</p>
        <p>
          ... and while you&apos;re at it, tell me a little about yourself! A great photo is one thing; a great experience is another. The better I get to know who I&apos;m working with, the more natural I&apos;m able to help you feel, and the more we can make your photos <em>your</em> photos.
        </p>
        <p>
          To help bridge the gap, you can read a little <Link href="/frame-it-wright-photography">about me</Link> here! :)
        </p>
      </div>
      <section aria-labelledby="inquiry-heading" className="not-prose max-w-2xl border-y border-stone-300 py-7 dark:border-stone-700">
        <h2 id="inquiry-heading" className="mb-3 font-serif text-sm lowercase tracking-widest">start a conversation</h2>
        <p className="mb-7 text-sm leading-6">
          Reach out <Link href="mailto:frameitwright@gmail.com" className="text-olive underline underline-offset-4">frameitwright@gmail.com</Link> directly, or prepare a draft below!
        </p>
        <BookingInquiry />
      </section>
      <p className="max-w-2xl text-xs leading-6 text-stone-600 dark:text-stone-400">
        Following along? The <Link href="/creative/mailing-list">creative mailing list</Link> is for occasional writing and creative updates.
        Booking inquiries do not subscribe you to it.
      </p>
    </PhotographyShell>
  );
}
