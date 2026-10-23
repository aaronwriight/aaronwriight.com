# Resend mailing lists

Subscriber addresses and API keys should not be committed to Git. When configured, the forms store contacts in private Resend Segments; this repository stores the forms, API integration, and one broadcast template per Scope for Imagination journal entry.

If an API key is pasted into chat, an issue, or any committed file, revoke it in Resend and create a replacement key.

## One-time Resend setup

1. Create a Resend account.
2. Use `onboarding@resend.dev` only for testing to the email address attached to the Resend account.
3. Add and verify the sending subdomain `updates.aaronwriight.com` before sending to anyone else. The site's domain, `aaronwriight.com`, is registered through Vercel, so its DNS records live in Vercel.
   - In Resend's Domains page, add `updates.aaronwriight.com` and choose **Auto Configure**. Resend uses Domain Connect to write its records into Vercel DNS after you authorize it.
   - To add the records by hand instead, copy each one exactly from the domain's Records tab into the DNS records form for `aaronwriight.com` in Vercel's team Domains page. Enter only the prefix as the name (for example `send.updates` or `resend._domainkey.updates`).
   - `updates.aaronwriight.com` only sends; it has no mailbox. Set `SFI_NEWSLETTER_REPLY_TO` to an inbox you read so replies reach you instead of bouncing.
   - After verification, add a DMARC TXT record named `_dmarc` that starts with `v=DMARC1; p=none;` and a `rua=mailto:` address you read. Tighten the policy once reports show mail passing.
4. Create two Segments:
   - `Scope for Imagination`
   - `Creative Updates` (a new, separate opt-in; do not reuse or bulk-import the photography or SFI list)
5. Create string Contact Properties for:
   - `source`
   - `interest`
   - `creative_interest`
6. Create an API key with **Full access**. A Sending access key cannot manage contacts, segments, or broadcasts, so every signup would fail and `pnpm writing newsletter` could not create drafts.
7. Add these environment variables locally and in Vercel:

```text
RESEND_API_KEY=re_...
RESEND_SFI_SEGMENT_ID=...
RESEND_CREATIVE_SEGMENT_ID=...
SFI_NEWSLETTER_FROM="Scope for Imagination <journal@updates.aaronwriight.com>"
# Optional: replies to newsletters go here instead of bouncing.
SFI_NEWSLETTER_REPLY_TO=you@example.com
NEXT_PUBLIC_SITE_URL=https://aaronwriight.com
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-22
# Required: the homepage loads it, and src/sanity/lib/token.ts throws without it.
SANITY_API_READ_TOKEN=...
# Optional: only needed for the legacy Sanity mirror tool.
SANITY_API_WRITE_TOKEN=...
```

Until the relevant variables are configured, each signup form safely reports that signup is still being configured.

## Before Launch

- Revoke any API key that has been pasted into chat or a public issue, then create a fresh key for Vercel.
- Confirm the sending domain is `Verified` in Resend. A domain name being accepted in the Resend UI is not enough; the DNS records must verify.
- Confirm both segment IDs in Vercel match the intended Resend Segments.
- Confirm all Contact Properties above exist before testing live submissions, otherwise Resend can reject contacts that include those properties.
- Submit one test signup for each form and confirm the contact appears in the correct segment.
- Use either in-page unsubscribe form with a test address and confirm the contact becomes globally unsubscribed in Resend.

## Forms

- `/scope-for-imagination/mailing-list` adds subscribers through `/api/newsletter/subscribe` to `RESEND_SFI_SEGMENT_ID`.
- `/creative/mailing-list` adds subscribers through `/api/creative/mailing-list/subscribe` to `RESEND_CREATIVE_SEGMENT_ID`. It stores `creative_interest` separately from SFI preferences. Missing Creative setup never falls back to the SFI segment.
- `/frame-it-wright-photography/mailing-list` permanently redirects to `/frame-it-wright-photography/booking`. The old photography subscribe API returns HTTP 410 and no longer stores intake details. Existing contacts in the old photography segment are untouched; they are not subscribed to Creative automatically. `RESEND_PHOTOGRAPHY_SEGMENT_ID` is no longer used by the website.
- Both unsubscribe forms call `/api/newsletter/unsubscribe` and set the contact's global Resend unsubscribe status, stopping every Broadcast from this Resend account. Joining again re-enables the contact globally, including previously joined segments; both behaviors are stated on the forms. Membership and subscriber addresses are not exposed in responses.
- The API routes validate the payload and always return JSON without caching. Success is returned only after Resend confirms the required writes. Malformed data, honeypot submissions, missing configuration, and upstream failures never produce a saved-subscription message. Errors log only a status code or a generic network failure, never an upstream response body.
- The browser requires a successful JSON response with a message before showing success. These are single opt-in forms using the existing Resend contact integration; no confirmation email or automatic broadcast is sent by signup.

## Publishing And Email Workflow

The canonical author and newsletter workflow is documented in [`writing/README.md`](../writing/README.md). In brief, publish and verify the post first, then create a Resend draft with:

```sh
pnpm writing newsletter NNNN
```

Preview newsletter generation without contacting Resend with `--dry-run`. Immediate sending requires the explicit `--send` flag and an interactive confirmation unless `--yes` is deliberately supplied. Publishing a post never emails the list automatically.


## Booking is a separate email conversation

The booking page prepares an email draft from the client's contact details, shoot type, and idea. First name, last name, email, shoot type, a location choice, and the idea are required. The six shoot choices come from `src/data/photography.ts`, excluding Travel. A known location needs only a venue name or area; “I'm not sure” reveals an optional scenery/vibe prompt. Date range or season, travel flexibility, a separate introduction, phone, and a request to arrange a call are optional. A call can be arranged by email without supplying a phone number.

The form keeps values in browser memory and creates an encoded `mailto:` link to the existing public photography address. The visitor opens, reviews, and sends that draft from their own email app. The form remains disabled until JavaScript is ready; without JavaScript, the email link is the fallback and the inputs cannot be submitted as a native request. There is no booking submission endpoint, reservation, automatic response, or newsletter signup. The visible email address also works as a fallback if no email app is configured. Availability, scope, pricing, and delivery are agreed by email or phone.

## Creative broadcasts and manual setup

Create the Creative Updates segment and `creative_interest` string property in Resend, then set `RESEND_CREATIVE_SEGMENT_ID` on the intended Vercel environments before testing with an address you control. A `503` response until configuration is complete is intentional. The existing shared API key still needs permission to manage contacts and segments. No account settings or environment values were changed as part of the page implementation.

Creative signup prepares the audience, not an automatic delivery pipeline for every blog. Compose and review Creative broadcasts manually in Resend and deliberately select the Creative segment. The SFI newsletter command remains scoped to SFI and does not email Creative subscribers. Do not migrate old audiences without their intended consent.

## Offline verification

```sh
node --test scripts/test_newsletter.mjs
```

Tests intercept every Resend request and use fake credentials. They cover validation, separate audiences, pending writes, existing contacts, partial failures, error privacy, and unsubscribe behavior. They do not verify a live account, domain, delivery, or contact property configuration.

The payloads follow Resend's [Create Contact](https://resend.com/docs/api-reference/contacts/create-contact), [Update Contact](https://resend.com/docs/api-reference/contacts/update-contact), and [Add Contact to Segment](https://resend.com/docs/api-reference/contacts/add-contact-to-segment) APIs. Resend documents the [global subscription setting](https://resend.com/blog/unsubscribe-topics); this integration retains that existing global unsubscribe model. Documentation reviewed 2026-10-10.
