export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResendProperties = Record<string, string | undefined>;

type UpsertResendContactInput = {
  apiKey: string;
  segmentId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  properties?: ResendProperties;
};

export class ResendContactError extends Error {
  status: number;

  constructor(status: number) {
    super(`Resend request failed (HTTP ${status}).`);
    this.name = "ResendContactError";
    this.status = status;
  }
}

function cleanProperties(properties: ResendProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties)
      .map(([key, value]) => [key, value?.trim()])
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

// Adds the address to the segment, creating the contact if it is new. `created` is true only for a contact Resend had
// never seen, which is when the welcome email goes out (an existing contact rejoining or joining a second list is not
// welcomed again).
export async function upsertResendContact({
  apiKey,
  segmentId,
  email,
  firstName,
  lastName,
  properties,
}: UpsertResendContactInput): Promise<{ created: boolean }> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const cleanFirstName = firstName?.trim() || undefined;
  const cleanLastName = lastName?.trim() || undefined;
  const cleanContactProperties = cleanProperties(properties);

  const response = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      first_name: cleanFirstName,
      last_name: cleanLastName,
      unsubscribed: false,
      properties: cleanContactProperties,
      segments: [{ id: segmentId }],
    }),
  });

  if (response.ok) return { created: true };

  if (response.status !== 409) {
    throw new ResendContactError(response.status);
  }

  const updateResponse = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      first_name: cleanFirstName,
      last_name: cleanLastName,
      unsubscribed: false,
      properties: cleanContactProperties,
    }),
  });
  if (!updateResponse.ok) throw new ResendContactError(updateResponse.status);
  const segmentResponse = await fetch(
    `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
    { method: "POST", headers: { Authorization: `Bearer ${apiKey}` } },
  );
  if (segmentResponse.ok) return { created: false };
  throw new ResendContactError(segmentResponse.status);
}

export async function sendResendEmail({
  apiKey, from, to, subject, html, text, replyTo,
}: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!response.ok) throw new ResendContactError(response.status);
}

export async function unsubscribeResendContact({
  apiKey,
  email,
}: {
  apiKey: string;
  email: string;
}) {
  const response = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ unsubscribed: true }),
  });

  // Do not reveal whether an address is present in the private contact list.
  if (response.ok || response.status === 404) return;

  throw new ResendContactError(response.status);
}
