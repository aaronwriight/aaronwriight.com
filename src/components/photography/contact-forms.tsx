"use client";

import { type FormEvent, useEffect, useId, useState } from "react";
import { BookingInquiry } from "@/components/site/booking-inquiry";

const fieldClass = "w-full border border-stone-300 bg-white px-3 py-2 font-serif text-sm text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100";
const labelClass = "block space-y-1.5 text-xs text-stone-600 dark:text-stone-400";

const tabs = [
  { key: "booking", label: "booking a session" },
  { key: "general", label: "general question" },
] as const;
type Tab = (typeof tabs)[number]["key"];

// The contact page's two ways in: booking a session (the full inquiry) or a general question (name, email, subject,
// message). Both only prepare an email draft. A link to #general opens the general form.
export function ContactForms() {
  const [tab, setTab] = useState<Tab>("booking");
  const id = useId();

  useEffect(() => {
    if (window.location.hash === "#general") setTab("general");
  }, []);

  return (
    <div>
      <div role="tablist" aria-label="What would you like to talk about?" className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-300 dark:border-stone-700">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${id}-${key}-tab`}
            aria-selected={tab === key}
            aria-controls={`${id}-${key}`}
            onClick={() => setTab(key)}
            className={`-mb-px cursor-pointer border-b-2 pb-2.5 font-mono text-[0.72rem] tracking-[0.1em] ${tab === key ? "border-wright text-stone-900 dark:text-stone-100" : "border-transparent text-stone-500 hover:text-wright"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-booking`} aria-labelledby={`${id}-booking-tab`} hidden={tab !== "booking"}>
        <BookingInquiry />
      </div>
      <div role="tabpanel" id={`${id}-general`} aria-labelledby={`${id}-general-tab`} hidden={tab !== "general"}>
        <GeneralInquiry />
      </div>
    </div>
  );
}

function GeneralInquiry() {
  const [draftHref, setDraftHref] = useState("");
  const [ready, setReady] = useState(false);

  // As with the booking form: without JavaScript the form stays disabled, so nothing can be sent from it.
  useEffect(() => setReady(true), []);

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) || "").trim();
    const body = ["Hi Aaron,", "", value("message"), "", value("name"), value("email")].join("\n");
    const subject = value("subject") || "A question";
    setDraftHref(`mailto:frameitwright@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  return (
    <form onSubmit={prepareDraft} onChange={() => setDraftHref("")} aria-label="Prepare a general message">
      <fieldset disabled={!ready} className="space-y-5 disabled:opacity-60">
        <legend className="sr-only">Your message</legend>
        <p className="text-xs leading-5 text-stone-600 dark:text-stone-400">A question about prints, a collaboration, or anything else that isn&apos;t a session.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            <span className="block tracking-wide">Name *</span>
            <input name="name" autoComplete="name" maxLength={160} required className={fieldClass} />
          </label>
          <label className={labelClass}>
            <span className="block tracking-wide">Email *</span>
            <input name="email" type="email" autoComplete="email" maxLength={254} required className={fieldClass} />
          </label>
        </div>
        <label className={labelClass}>
          <span className="block tracking-wide">Subject (optional)</span>
          <input name="subject" maxLength={160} className={fieldClass} />
        </label>
        <label className={labelClass}>
          <span className="block tracking-wide">Message *</span>
          <textarea name="message" maxLength={3000} rows={6} required className={`${fieldClass} resize-y`} />
        </label>
        <p className="m-0 text-xs leading-6 text-stone-600 dark:text-stone-400">
          This prepares an email draft. Nothing is sent from this page; review it and send it yourself when you&apos;re ready.
        </p>
        <button type="submit" className="border border-stone-400 px-4 py-2 font-serif text-xs lowercase tracking-widest text-stone-900 hover:border-stone-700 hover:text-wright dark:border-stone-600 dark:text-stone-100 dark:hover:border-stone-300">
          prepare a message
        </button>
        <div aria-live="polite" aria-atomic="true">
          {draftHref && (
            <div className="space-y-3 border-l-2 border-stone-400 pl-4 text-sm leading-6 dark:border-stone-600">
              <p className="m-0">Your draft is ready. Open it in your email app, review it, and send it.</p>
              <a href={draftHref} className="inline-block text-wright underline underline-offset-4">open email draft</a>
            </div>
          )}
        </div>
      </fieldset>
    </form>
  );
}
