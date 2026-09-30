import type { Metadata } from "next";
import { ScienceShell } from "@/components/science/science-content";

export const metadata: Metadata = {
  title: "mentorship",
  description: "Mentorship by Aaron Wright",
};

export default function MentorshipPage() {
  return (
    <ScienceShell title="mentorship">
      <p>To me, science is <em>mentorship</em>.</p>
      <p>Professionally, I pursue questions about the brain and language.</p>
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
        scientifically, and personally – and I hold my study of language cognition and communication (and all I do outside of that) as central to
        that aim.
      </p>
      <p>
        Specifically, I am interested in understanding the social mind in dialogue, or how the human brain processes language and structures
        conversation in various contexts:
      </p>
      <ul>
        <li>
          <strong>Emotion &amp; affect in conversation</strong> (How do we represent others’ mental and emotional states during conversation, and how
          do these representations guide conversational behavior?)
        </li>
        <li>
          <strong>Miscommunication</strong> (Why do we miscommunicate, and how do we anticipate, identify, and repair miscommunication?)
        </li>
        <li>
          <strong>Culture &amp; bilingualism</strong> (How does linguistic experience influence language cognition and communication?)
        </li>
      </ul>
    </ScienceShell>
  );
}
