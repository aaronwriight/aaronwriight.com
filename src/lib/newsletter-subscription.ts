import { jsonMessage } from "@/lib/api-response";
import { emailPattern, ResendContactError, upsertResendContact } from "@/lib/resend-contacts";

export async function readNewsletterBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await request.text();
    if (text.length > 4096) return null;
    const body: unknown = JSON.parse(text);
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

type NewsletterConfiguration = {
  segmentVariable: "RESEND_SFI_SEGMENT_ID" | "RESEND_CREATIVE_SEGMENT_ID";
  interests: readonly string[];
  source: string;
  interestProperty?: string;
  successMessage: string;
};

export function createNewsletterSubscription({
  segmentVariable, interests, source, interestProperty = "interest", successMessage,
}: NewsletterConfiguration) {
  return async function POST(request: Request) {
    const body = await readNewsletterBody(request);
    // The honeypot must not claim that a rejected submission was saved.
    if (!body || body.company) return jsonMessage("Please submit the form again.", 400);

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const interest = body.interest === undefined ? "everything" : body.interest;

    if (!emailPattern.test(email) || email.length > 254) {
      return jsonMessage("Please enter a valid email address.", 400);
    }
    if (firstName.length > 80 || lastName.length > 80) {
      return jsonMessage("Please keep each name to 80 characters or fewer.", 400);
    }
    if (typeof interest !== "string" || !interests.includes(interest)) {
      return jsonMessage("Please choose an interest from the list.", 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env[segmentVariable];
    if (!apiKey || !segmentId) {
      return jsonMessage("Sign-up is being configured. Please check back soon.", 503);
    }

    try {
      await upsertResendContact({
        apiKey, segmentId, email, firstName, lastName,
        properties: { [interestProperty]: interest, source },
      });
      return jsonMessage(successMessage);
    } catch (error) {
      // Upstream error bodies may contain contact details. Log only status.
      console.error("Newsletter subscription failed", error instanceof ResendContactError ? error.status : "network error");
      return jsonMessage("I couldn’t add you just now. Please try again shortly.", 502);
    }
  };
}
