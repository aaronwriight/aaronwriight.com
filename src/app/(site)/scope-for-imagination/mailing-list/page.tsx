import type { Metadata } from "next";
import { JournalShell } from "@/components/site/site-content";
import { NewsletterSignup } from "@/components/site/newsletter-signup";

export const metadata: Metadata = {
  title: "mailing list | scope for imagination",
  description: "Subscribe to Scope for Imagination updates.",
};

export default function MailingListPage() {
  return (
    <JournalShell
      title="mailing list"
      subtitle="get an occasional email when a new entry finds its way into Scope for Imagination."
    >
      <div className="not-prose max-w-2xl">
        <NewsletterSignup />
      </div>
    </JournalShell>
  );
}
