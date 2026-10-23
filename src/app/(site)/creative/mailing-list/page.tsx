import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/site/newsletter-signup";
import { CreativeShell } from "@/components/site/site-content";

export const metadata: Metadata = {
  title: "mailing list | creative",
  description: "Occasional updates on blogs, writing, photography, and other creative work by Aaron Wright.",
  alternates: { canonical: "/creative/mailing-list" },
};

export default function CreativeMailingListPage() {
  return (
    <CreativeShell title="mailing list">
      <div className="max-w-2xl space-y-5">
        <p>A quiet place to keep in touch: new writing, notes from the blogs, and creative projects as they take shape.</p>
        <p>
          Follow along with <Link href="/scope-for-imagination">Scope for Imagination</Link>, <Link href="/venture">Venture</Link>,
          photography, and other work in progress. For a session or collaboration, visit <Link href="/frame-it-wright-photography/booking">booking</Link>.
        </p>
      </div>
      <div className="not-prose max-w-2xl border-t border-stone-300 pt-7 dark:border-stone-700">
        <NewsletterSignup
          endpoint="/api/creative/mailing-list/subscribe"
          description="By joining, you agree to receive occasional emails about writing and creative work. Your email and the details you choose to share are stored with Resend to manage these updates. Unsubscribe whenever you like."
          submitLabel="join the creative list"
          interestOptions={[
            { value: "everything", label: "all creative updates" },
            { value: "writing", label: "blogs & writing" },
            { value: "travel and adventure", label: "travel & adventure" },
            { value: "photography", label: "photography & visual work" },
          ]}
        />
      </div>
    </CreativeShell>
  );
}
