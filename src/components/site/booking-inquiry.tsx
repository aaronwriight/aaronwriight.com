"use client";

import { type FormEvent, useEffect, useId, useState } from "react";
import { photographyShootTypes } from "@/data/photography";

const fieldClass = "w-full border border-stone-300 bg-white px-3 py-2 font-serif text-sm text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100";
const labelClass = "block space-y-1.5 text-xs text-stone-600 dark:text-stone-400";

export function BookingInquiry() {
  const [draftHref, setDraftHref] = useState("");
  const [formError, setFormError] = useState("");
  const [locationChoice, setLocationChoice] = useState("");
  const [ready, setReady] = useState(false);
  const id = useId();

  // Without JavaScript, keep the local-only form disabled so a native form
  // submission cannot place contact details in a URL or send them to the site.
  useEffect(() => setReady(true), []);

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) || "").trim();
    const requiredFields = ["firstName", "lastName", "email", "shootType", "locationChoice", "idea"];
    if (locationChoice === "known") requiredFields.push("location");
    for (const name of requiredFields) {
      if (!value(name)) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.setCustomValidity("Please complete this field.");
          field.reportValidity();
        }
        setFormError("Please complete the required fields before preparing your draft.");
        return;
      }
    }

    try {
      const location = locationChoice === "known"
        ? `Location: ${value("location")}`
        : `Location: I'm not sure\nScenery or vibe: ${value("scenery") || "To discuss"}`;
      const body = [
        "Hi Aaron,", "", "I'd like to talk about a photography project.", "",
        `First name: ${value("firstName")}`,
        `Last name: ${value("lastName")}`,
        `Email: ${value("email")}`,
        `Phone: ${value("phone") || "Not provided"}`, "",
        `Shoot type: ${value("shootType")}`,
        `Preferred date range or season: ${value("timing") || "Flexible / to discuss"}`,
        location,
        `Willing to travel: ${value("travel") || "To discuss"}`, "",
        "A little about me:", value("aboutYourself") || "Not provided", "",
        "A little about my idea:", value("idea"), "",
        data.get("requestCall") === "yes"
          ? "I'd like to arrange a call to discuss ideas and plans. Please email me to find a time."
          : "Let's start by email.",
      ].join("\n");
      setDraftHref(`mailto:frameitwright@gmail.com?subject=${encodeURIComponent(`Photography inquiry: ${value("shootType")}`)}&body=${encodeURIComponent(body)}`);
      setFormError("");
    } catch {
      setFormError("I couldn’t prepare that draft. Please try again, or email frameitwright@gmail.com directly.");
    }
  }

  function clearDraft(event: FormEvent<HTMLFormElement>) {
    setDraftHref("");
    setFormError("");
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      field.setCustomValidity("");
    }
  }

  return (
    <form onSubmit={prepareDraft} onChange={clearDraft} onInvalid={() => setFormError("Please check the required fields and your email address.")} aria-label="Prepare a photography inquiry">
      <noscript><p className="mb-5 text-sm leading-6">This draft form needs JavaScript. You can reach out using the email link above.</p></noscript>
      <fieldset disabled={!ready} className="space-y-8 disabled:opacity-60">
        <legend className="sr-only">Photography inquiry details</legend>
        <p className="text-xs leading-5 text-stone-600 dark:text-stone-400">Fields marked * are required. Everything else is a starting point; it is okay to still be figuring things out.</p>
        <fieldset className="space-y-5">
          <legend className="mb-4 font-serif text-sm">Let&apos;s get acquainted</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              <span className="block tracking-wide">First name *</span>
              <input name="firstName" autoComplete="given-name" maxLength={80} required className={fieldClass} />
            </label>
            <label className={labelClass}>
              <span className="block tracking-wide">Last name *</span>
              <input name="lastName" autoComplete="family-name" maxLength={80} required className={fieldClass} />
            </label>
            <label className={labelClass}>
              <span className="block tracking-wide">Email *</span>
              <input name="email" type="email" autoComplete="email" maxLength={254} required className={fieldClass} />
            </label>
            <label className={labelClass}>
              <span className="block tracking-wide">Phone (optional)</span>
              <input name="phone" type="tel" autoComplete="tel" maxLength={60} className={fieldClass} />
            </label>
          </div>
          <label className="flex items-start gap-3 text-xs leading-6 text-stone-600 dark:text-stone-400">
            <input name="requestCall" type="checkbox" value="yes" aria-describedby={`${id}-call-note`} className="mt-1 h-4 w-4 shrink-0 accent-olive" />
            <span>I&apos;d like to arrange a call about ideas and plans (optional)</span>
          </label>
          <p id={`${id}-call-note`} className="text-xs leading-6 text-stone-600 dark:text-stone-400">We can find a time by email. No need to have everything figured out, or to share your phone number yet.</p>
        </fieldset>

        <fieldset className="space-y-5 border-t border-stone-300 pt-6 dark:border-stone-700">
          <legend className="pr-3 font-serif text-sm">The shoot you have in mind</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              <span className="block tracking-wide">Shoot type *</span>
              <select name="shootType" className={fieldClass} defaultValue="" required>
                <option value="" disabled>Choose a shoot type</option>
                {photographyShootTypes.map((shootType) => <option key={shootType} value={shootType}>{shootType}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              <span className="block tracking-wide">Preferred date range or season (optional)</span>
              <input name="timing" maxLength={160} placeholder="A few dates, a season, or flexible" className={fieldClass} />
            </label>
          </div>
          <label className={labelClass}>
            <span className="block tracking-wide">Location *</span>
            <select name="locationChoice" value={locationChoice} onChange={(event) => setLocationChoice(event.target.value)} required className={fieldClass} aria-controls={`${id}-location-details`}>
              <option value="" disabled>Have a place in mind?</option>
              <option value="known">I have a location in mind</option>
              <option value="unsure">I&apos;m not sure</option>
            </select>
          </label>
          <div id={`${id}-location-details`}>
            {locationChoice === "known" && (
              <label className={labelClass}>
                <span className="block tracking-wide">Location or area *</span>
                <input name="location" autoComplete="address-level2" maxLength={160} required placeholder="A venue, town, or general area — no street address needed" className={fieldClass} />
              </label>
            )}
            {locationChoice === "unsure" && (
              <div className="space-y-1.5">
                <label className={labelClass}>
                  <span className="block tracking-wide">Scenery or vibe (optional)</span>
                  <textarea name="scenery" maxLength={600} rows={3} placeholder="What would feel like you? A quiet trail, city streets, a cozy space…" className={`${fieldClass} resize-y`} aria-describedby={`${id}-scenery-note`} />
                </label>
                <p id={`${id}-scenery-note`} className="text-xs leading-5 text-stone-600 dark:text-stone-400">Tell me what you imagine so I can help explore places that fit.</p>
              </div>
            )}
          </div>
          <label className={labelClass}>
            <span className="block tracking-wide">How far could you travel? (optional)</span>
            <input name="travel" maxLength={160} placeholder="Local only, within an hour, or flexible" className={fieldClass} />
          </label>
        </fieldset>

        <section className="space-y-3 border-t border-stone-300 pt-6 dark:border-stone-700" aria-labelledby={`${id}-about-heading`}>
          <h3 id={`${id}-about-heading`} className="font-serif text-sm">Tell me about yourself!</h3>
          <p id={`${id}-about-note`} className="text-xs leading-6 text-stone-600 dark:text-stone-400">Optional, and entirely up to you: your interests, the people joining you, or what helps you feel at ease.</p>
          <label htmlFor={`${id}-about`} className="sr-only">Tell me about yourself! (optional)</label>
          <textarea id={`${id}-about`} name="aboutYourself" maxLength={1000} rows={4} aria-describedby={`${id}-about-note`} className={`${fieldClass} resize-y`} />
        </section>

        <label className={labelClass}>
          <span className="block font-serif text-sm text-stone-900 dark:text-stone-100">A little about your idea *</span>
          <textarea name="idea" maxLength={1500} rows={5} required placeholder="What would your perfect shoot look like?" className={`${fieldClass} resize-y`} />
        </label>
        <p className="text-xs leading-6 text-stone-600 dark:text-stone-400">
          This prepares an email draft. Your details stay in this page until you open the draft; review and send it yourself when you are ready. Nothing is booked or sent from this form.
        </p>
        {formError && <p role="alert" className="text-xs leading-6 text-red-700 dark:text-red-400">{formError}</p>}
        <button type="submit" className="border border-stone-400 px-4 py-2 text-xs lowercase tracking-widest text-stone-900 font-serif hover:border-stone-700 hover:text-olive focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-300">
          prepare an inquiry
        </button>
        <div aria-live="polite" aria-atomic="true">
          {draftHref && (
            <div className="space-y-3 border-l-2 border-stone-400 pl-4 text-sm leading-6 dark:border-stone-600">
              <p>Your draft is ready. Open it in your email app, review it, and send it to start the conversation.</p>
              <a href={draftHref} className="inline-block text-olive underline underline-offset-4">open email draft →</a>
            </div>
          )}
        </div>
      </fieldset>
    </form>
  );
}
