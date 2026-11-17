import type { Metadata } from "next";
import Link from "next/link";
import { ScienceShell } from "@/components/science/science-content";
import { centralQuestion, researchFocus, researchTrails } from "@/data/science";

export const metadata: Metadata = {
  title: "mentorship",
  description: "Mentorship by Aaron Wright",
};

export default function MentorshipPage() {
  return (
    <ScienceShell title="mentorship">
      <p>To me, science is <em>mentorship</em>.</p>
      <p>Professionally, I pursue questions about how minds and bodies make meaning together in conversation.</p>
      <p>
        Personally, I pursue others’ wellbeing and development through scientific and personal mentorship and experiential education – growth
        through facilitated activities, intentional reflection, and community discussion.
      </p>
      <p>
        I conceptualize my vocation (within and beyond cognitive science) as an experience of mentorship, formed intimately by my experiences in
        community. I’ve been privileged to receive wisdom from several kind, driven mentors and scholars, and my aspirations reflect their
        investment as much as my own passions. They’ve demonstrated that mentorship in science need not subordinate holistic, interpersonal
        flourishing to scientific advancement –– rather, successful research involves developing both critical technical skills and rich
        interpersonal perspectives. In response to their guidance, I’ve grown deeply passionate about mentoring young scholars – both
        scientifically, and personally – and I hold my study of embodied conversation (and all I do outside of that) as central to that aim.
      </p>
      <p>
        Specifically, I study {researchFocus.name}: {researchFocus.line}. Conversation is something we do with our whole selves, not only
        with words, and at the heart of my work is one question:{" "}
        <em>{centralQuestion.charAt(0).toLowerCase() + centralQuestion.slice(1)}</em> It runs along three lines:
      </p>
      <ul>
        {researchTrails.map((trail) => (
          <li key={trail.title}>
            <strong className="text-olive">{trail.title}</strong>: <em>{trail.question}</em>
          </li>
        ))}
      </ul>
      <p>
        There&apos;s more on each in my <Link href="/cognitive-science/about#research-overview">research overview</Link>.
      </p>
    </ScienceShell>
  );
}
