import { createNewsletterSubscription } from "@/lib/newsletter-subscription";

export const POST = createNewsletterSubscription({
  segmentVariable: "RESEND_SFI_SEGMENT_ID",
  interests: ["everything", "life updates", "reflections", "cognitive science", "photography", "travel and adventure", "faith"],
  source: "scope_for_imagination",
  successMessage: "You’re on the list—thank you!",
});
