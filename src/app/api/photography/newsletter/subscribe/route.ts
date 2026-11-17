import { createNewsletterSubscription } from "@/lib/newsletter-subscription";
import { photographyWelcome } from "@/lib/welcome-email";

// Frame it Wright's newsletter is a subset of the creative newsletter: the same Resend segment, recorded as interested
// in photography, so a photography email can go to just these people (or to everyone on the creative list).
export const POST = createNewsletterSubscription({
  segmentVariable: "RESEND_CREATIVE_SEGMENT_ID",
  interests: ["photography"],
  defaultInterest: "photography",
  source: "frame_it_wright",
  interestProperty: "creative_interest",
  successMessage: "You’re on the Frame it Wright list—thank you!",
  welcome: photographyWelcome,
});
