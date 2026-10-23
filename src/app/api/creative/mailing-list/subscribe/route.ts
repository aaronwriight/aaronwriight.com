import { createNewsletterSubscription } from "@/lib/newsletter-subscription";

export const POST = createNewsletterSubscription({
  segmentVariable: "RESEND_CREATIVE_SEGMENT_ID",
  interests: ["everything", "writing", "travel and adventure", "photography"],
  source: "creative",
  interestProperty: "creative_interest",
  successMessage: "You’re on the creative list—thank you!",
});
