import { jsonMessage } from "@/lib/api-response";
import { emailPattern, ResendContactError, unsubscribeResendContact } from "@/lib/resend-contacts";
import { readNewsletterBody } from "@/lib/newsletter-subscription";

export async function POST(request: Request) {
  const body = await readNewsletterBody(request);
  if (!body) {
    return jsonMessage("Please submit the form again.", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!emailPattern.test(email) || email.length > 254) {
    return jsonMessage("Please enter a valid email address.", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonMessage("Unsubscribe is being configured. Please check back soon.", 503);
  }

  try {
    await unsubscribeResendContact({ apiKey, email });
    return jsonMessage("You’ve been unsubscribed.");
  } catch (error) {
    console.error("Newsletter unsubscribe failed", error instanceof ResendContactError ? error.status : "network error");
    return jsonMessage("I couldn’t unsubscribe you just now. Please try again shortly.", 502);
  }
}
