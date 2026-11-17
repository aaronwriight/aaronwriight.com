import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/site/newsletter-signup";
import { photoPath } from "@/data/photography";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "newsletter",
  description: "An occasional email from Frame it Wright Photography: new photographs, new sessions, and open dates.",
  alternates: { canonical: "/newsletter" },
};

// Frame it Wright's newsletter: the photography part of the creative newsletter (api/photography/newsletter).
export default function PhotographyNewsletterPage() {
  return (
    <div className="fiw-wrap grid max-w-3xl gap-10 pt-12 pb-20">
      <header className="grid gap-4">
        <span className="fiw-eyebrow">newsletter</span>
        <h1 className="fiw-title m-0 text-[clamp(2.8rem,6vw,4.4rem)]">Stay in the frame</h1>
        <p className="m-0 max-w-2xl text-lg leading-relaxed">
          An occasional email when there are new photographs to share, a new session to show off, or dates opening up for
          the season ahead. Nothing more, and never more than now and then.
        </p>
      </header>
      <section aria-label="Sign up" className="border border-stone-300 bg-band p-6 sm:p-8 dark:border-stone-700">
        <NewsletterSignup
          endpoint="/api/photography/newsletter/subscribe"
          description="By joining, you agree to occasional Frame it Wright Photography emails. They're part of my creative newsletter, so your email and name are stored with Resend to manage these updates. Unsubscribe whenever you like."
          submitLabel="join the newsletter"
          interestOptions={[]}
        />
      </section>
      <p className="m-0 text-sm leading-6 text-stone-600 dark:text-stone-400">
        Want my writing and other projects too? The <a href={`${siteUrl}/creative/newsletter`} className="fiw-link">creative newsletter</a> has
        all of it. Ready to book? <Link href={photoPath("/contact")} className="fiw-link">Get in touch</Link>.
      </p>
    </div>
  );
}
