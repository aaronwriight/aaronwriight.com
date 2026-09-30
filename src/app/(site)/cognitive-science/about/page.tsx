import type { Metadata } from "next";
import Link from "next/link";
import { ScienceShell, TopicDetails } from "@/components/science/science-content";
import { DisclosureSection } from "@/components/site/disclosure-section";

export const metadata: Metadata = {
  title: "science about",
  description: "Research interests and academic background for Aaron Wright",
};

function TimelineEntry({ date, secondary = false, children }: {
  date: string;
  secondary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="grid gap-x-5 gap-y-1 pl-0 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
      <span className="whitespace-nowrap text-stone-500 tabular-nums">{date}</span>
      <div className={`min-w-0 ${secondary ? "border-l border-stone-200 pl-4 dark:border-stone-700" : ""}`}>
        {children}
      </div>
    </li>
  );
}

export default function CognitiveScienceAboutPage() {
  return (
    <ScienceShell title="about">
      <p>Hi, I&apos;m Aaron! :)</p>
      <p>I&apos;m creative, but I try to be empirical too, lol.</p>

      <div className="divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
        <DisclosureSection id="research-overview" title="Research overview">
          <p>
            I study the <span className="text-[#6f8200]"><em>social mind in dialogue</em></span>: how the human brain processes{" "}
            <span className="text-[#6f8200]"><em>language</em></span> and structures{" "}
            <span className="text-[#6f8200]"><em>conversation</em></span>.
          </p>

          <p>
            My interests and experiences brought me to MIT&apos;s{" "}
            <Link href="https://bcs.mit.edu">Brain & Cognitive Sciences</Link> department and the{" "}
            <Link href="https://mcgovern.mit.edu">McGovern Institute for Brain Research</Link>, where I worked with{" "}
            <Link href="https://www.evlab.mit.edu/about-ev">Ev Fedorenko</Link> and an incredible team of language scientists at{" "}
            <Link href="https://www.evlab.mit.edu">EvLab</Link>. While my research broadly aims to chart the footprints of language cognition in
            conversation, my interests follow a few primary trails:
          </p>

          <ul>
            <li>
              <TopicDetails
                title="Emotion & affect in conversation"
                question="How do we represent others' mental and emotional states during conversation, and how do these representations guide conversational behavior?"
              >
                <p>
                  Conversation is one of the most natural, yet complex behaviors humans engage in. As people speak, they continuously signal
                  attitudes, intentions, and emotional states through cues such as prosody, pauses, word choice, and facial expressions. My work asks
                  how these emotional and mental-state representations are constructed during dialogue and how mechanisms like (mis)alignment shape the
                  unfolding interaction between speakers.
                </p>
                <TopicDetails title="Reactivity" question="Why does communication elicit strong reactions between speakers?">
                  <p>
                    Conversation contains several unique cues that carry information about emotional states and social goals. I am interested in how
                    these emotional experiences arise during conversation, how they are expressed through language and behavior, and how they influence
                    the subsequent course of conversation.
                  </p>
                </TopicDetails>
              </TopicDetails>
            </li>

            <li>
              <TopicDetails
                title="Miscommunication"
                question="Why do we miscommunicate, and how do we anticipate, identify, and repair miscommunication?"
              >
                <p>
                  Conversation works remarkably well given how little meaning is stated explicitly. Speakers rely heavily on context, shared assumptions,
                  and inference, rendering misinterpretation an inevitable feature of communication. I use neuroimaging and computational methods to
                  investigate when and why miscommunication arises and how people collaboratively restore shared meaning.
                </p>
                <TopicDetails title="Repair" question="How do we anticipate and resolve miscommunication during linguistic communication?">
                  <p>
                    In dialogue, we routinely correct ourselves and others. Repair sequences reveal the strategies people use to track listeners&apos;
                    understanding and update their own assumptions about what has been communicated.
                  </p>
                </TopicDetails>
              </TopicDetails>
            </li>

            <li>
              <TopicDetails
                title="Culture & bilingualism"
                question="How does linguistic experience influence language cognition and communication?"
              >
                <p>
                  Language experience shapes how people think, communicate, and interpret the world around them. Using neuroimaging and behavioral
                  methods, I study how linguistic and sociocultural differences shape the brain and mind, helping us discern which aspects of human
                  language are foundational versus flexible.
                </p>
              </TopicDetails>
            </li>
          </ul>

          <p>The brain&apos;s functional landscape is yet largely unexplored. Otherwise, if I&apos;m not doing science, I&apos;m probably hiking.</p>
        </DisclosureSection>

        <DisclosureSection id="timeline" title="Timeline">
          <p>
            I&apos;ve been privileged to work with and learn from several wonderful scholars, and my scientific lens is as much a product of their
            wisdom and prompting as it is formed around my own desire to mentor future scholars.
          </p>
          <ul role="list" className="list-none space-y-6 pl-0">
            <TimelineEntry date="2026 - Present">
              Most recently, I joined the{" "}
              <Link href="https://fpetzschner.com/lab/">Psychiatry, Embodiment and Computation (PEAC) Lab</Link>, within the Department of{" "}
              <Link href="https://copsy.brown.edu">Cognitive and Psychological Sciences (CoPsy)</Link> and{" "}
              <Link href="https://carney.brown.edu">Carney Institute for Brain Science</Link> at Brown. I&apos;m thrilled to be working with{" "}
              <Link href="https://fpetzschner.com/about/">Frederike Petzschner</Link> and her team to study embodied intelligence –– how brain-body
              interactions shape learning, emotion, and psychiatric vulnerability –– using computational modeling, neuroimaging (EEG, fMRI), and
              behavioral methods.
              <p className="mb-0 border-l border-stone-200 pl-4 dark:border-stone-700">
                  I&apos;m also excited to continue working with Oriel&apos;s group, and to extend our work to consider how individuals&apos; affective experiences
                  unfold over time.
              </p>
            </TimelineEntry>
            <TimelineEntry date="2024 - 2026">
              Just beforehand, I spent time &quot;<em>discovering how minds and brains create language</em>&quot; as a{" "}
              <Link href="https://bcs.mit.edu/postbac1">post-baccalaureate research assistant</Link> in{" "}
              <Link href="https://www.evlab.mit.edu/about-ev">Evelina Fedorenko&apos;s</Link> language lab at MIT. Here I&apos;ve worked with{" "}
              <Link href="https://a-wolna.github.io">Agata Wolna</Link>, using fMRI and other techniques to explore the neural signatures of language
              processing, including the broader language network and how monolinguals and bilinguals differ in production and comprehension.
            </TimelineEntry>
            <TimelineEntry date="2025" secondary>
              Simultaneously, I began collaborating with <Link href="https://yiyangteoh.com">Yi Yang Teoh</Link> in{" "}
              <Link href="https://www.feldmanhalllab.com">Oriel FeldmanHall&apos;s lab</Link> at Brown, thinking about individual differences in emotion
              semantics and their implications for behavioral wellbeing and decision making.
            </TimelineEntry>
            <TimelineEntry date="2020 - 2024">
              Previously, I received my B.S. from Gordon College, where <Link href="https://www.gordon.edu/susanbobb">Dr. Susan Bobb</Link> transformed
              my distinct appreciations for linguistic structure and the human mind into a unified love of language in the bilingual brain.{" "}
              <Link href="https://www.gordon.edu/peteriltis">Dr. Peter Iltis</Link> also fostered these passions by taking me on as a research assistant
              working with real-time MRI and acoustic data from brass instrumentalists.
            </TimelineEntry>
            <TimelineEntry date="2023 - 2024" secondary>
              During my undergraduate years, I also worked as a neuropsychology research assistant at the{" "}
              <Link href="https://www.bumc.bu.edu/fhs-bap/">Framingham Heart Study Brain Aging Program</Link>. Guidance from{" "}
              <Link href="https://heartbrain.hms.harvard.edu/people/julie-joyce-bs">Julie Joyce</Link> and{" "}
              <Link href="https://psychology.ku.edu/people/emma-muller">Emma Muller</Link> revealed to me the joy and importance of doing science
              with and for one&apos;s community.
            </TimelineEntry>
          </ul>
        </DisclosureSection>
      </div>
    </ScienceShell>
  );
}
