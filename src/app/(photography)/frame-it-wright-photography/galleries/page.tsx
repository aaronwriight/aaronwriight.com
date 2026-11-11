import type { Metadata } from "next";
import Link from "next/link";
import { CreateWithMe } from "@/components/photography/create-with-me";
import { photoPath, picTimeClientUrl } from "@/data/photography";

export const metadata: Metadata = {
  title: "galleries",
  description: "Find your photographs: client galleries from Frame it Wright Photography are delivered on Pic-Time.",
  alternates: { canonical: "/galleries" },
};

const steps = [
  { label: "01 · the invitation", text: "When your photographs are ready, an invitation to your private gallery arrives by email from Pic-Time." },
  { label: "02 · the wait", text: "[Your delivery time] after the session. I'll let you know if anything changes." },
  { label: "03 · keep them", text: "Download your photographs, share them with the people in them, and order prints right from the gallery." },
];

// For clients only: the way to delivered photographs on Pic-Time. No portfolio photographs here; those live in the
// portfolio. Elsewhere the link to this page reads "find your photos".
export default function PhotographyGalleriesPage() {
  return (
    <>
      <section className="fiw-wrap grid max-w-4xl gap-6 pt-14 pb-10">
        <span className="fiw-eyebrow">for clients</span>
        <h1 className="fiw-title m-0 text-[clamp(2.8rem,6vw,4.4rem)]">galleries</h1>
        <p className="m-0 max-w-xl text-lg leading-relaxed">
          Your photographs live on Pic-Time. Continue to my gallery page there to find your collection and follow the sign-in or access instructions.
        </p>
        <a href={picTimeClientUrl} className="fiw-link w-fit text-[1.9rem] italic leading-tight">Open your gallery on Pic-Time</a>
        <p className="m-0 max-w-xl text-stone-600 dark:text-stone-400">
          You&apos;ll continue on Pic-Time, which manages gallery access and sign-in. If your collection isn&apos;t listed, use the invitation sent to your email.
        </p>
      </section>
      <ol className="fiw-wrap m-0 grid max-w-4xl list-none gap-4 p-0 sm:grid-cols-3">
        {steps.map((step) => (
          <li key={step.label} className="grid content-start gap-2 rounded-[3px] border border-stone-300 bg-white p-5 dark:border-stone-700 dark:bg-paper-tint">
            <span className="fiw-mono text-wright">{step.label}</span>
            <span className="leading-relaxed">{step.text}</span>
          </li>
        ))}
      </ol>
      <p className="fiw-wrap m-0 max-w-4xl pt-8 text-stone-600 dark:text-stone-400">
        Can&apos;t find it? <Link href={photoPath("/contact")} className="fiw-link">Write to me</Link> and I&apos;ll help you find it.
      </p>
      <CreateWithMe clientLine={false} />
    </>
  );
}
