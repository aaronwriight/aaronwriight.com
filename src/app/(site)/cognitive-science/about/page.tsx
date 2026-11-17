import type { Metadata } from "next";
import Link from "next/link";
import { ScienceShell, TopicDetails } from "@/components/science/science-content";
import { centralQuestion, researchFocus, researchSources, researchTrails } from "@/data/science";

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
      {/* A secondary entry (alongside the one above) is set in by the same step as the research trails, its rule inside
          the text column rather than on its edge. */}
      <div className={`min-w-0 ${secondary ? "ml-5 border-l border-stone-200 pl-4 dark:border-stone-700" : ""}`}>
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

      {/* The page in three parts: a personal note (above), the research overview, then the timeline. Both sections are
          open, not fold-outs. */}
      <section id="research-overview" aria-labelledby="research-overview-title" className="scroll-mt-6">
        <h2 id="research-overview-title">Research overview</h2>
          {/* The program, then its question, in display type; the three trails below set their questions the same way. */}
          <div className="not-prose my-7 grid gap-2.5">
            <p className="research-program m-0">{researchFocus.title}</p>
            <p className="research-program-line m-0">{researchFocus.line.charAt(0).toUpperCase() + researchFocus.line.slice(1)}.</p>
          </div>

          <div className="not-prose my-9 grid gap-3">
            <p className="research-label m-0 font-bold text-olive">Central question</p>
            <p className="research-question m-0">{centralQuestion}</p>
          </div>

          <p>
            Conversation is an embodied process: something we do with our whole selves, not only with words. Like social
            interaction more broadly, it is inherently embodied, multi-level, and multi-person (
            <Link href={researchSources.lettieri2026.href}>{researchSources.lettieri2026.label}</Link>), and dynamic rather than a simple exchange
            of linguistic information: people continuously interpret one another, monitor their own internal
            states (e.g., emotional state, including valence and arousal; physiological state, including heart rate and breathing), adapt their
            behavior, and coordinate with their partners.
          </p>

          <p>
            A conversation, in this view, is one coupled system rather than two speakers taking turns. Each person infers internal states from
            the signals reaching them, regulates those states through action, and forecasts how they will change: a sensory–control loop (
            <Link href={researchSources.petzschner2021.href}>{researchSources.petzschner2021.label}</Link>). In conversation, one person&apos;s
            words, prosody, and timing are the other&apos;s input, so the two loops close through each other. That makes conversation the kind of
            dynamic, behaviorally engaged setting the study of interoception now needs to move from description to mechanism (
            <Link href={researchSources.avidan2026.href}>{researchSources.avidan2026.label}</Link>).
          </p>

          <ul className="research-trails">
            <li>
              <TopicDetails title={researchTrails[0].title} question={researchTrails[0].question} large>
                <p>
                  Listeners read a partner from far more than words: prosody, timing, and context all carry information about how someone is
                  doing, and the listener&apos;s own body may color that reading. Learning about other people is hard to model for just these
                  reasons, uncertain signals and layered stakes, which makes it a strong test of computational accounts of cognition (
                  <Link href={researchSources.feldmanhall2021.href}>{researchSources.feldmanhall2021.label}</Link>). I ask whether the body
                  colors that reading, and how: by shifting a listener&apos;s
                  internal state and testing whether it acts like a prior that pulls their inferences toward it, or changes how much they trust
                  their partner&apos;s cues.
                </p>
              </TopicDetails>
            </li>

            <li>
              <TopicDetails title={researchTrails[1].title} question={researchTrails[1].question} large>
                <p>
                  Talking is bodily work (every turn reshapes breathing), and conversations make demands people can see coming: taking the
                  floor, fielding a hard question. I ask whether bodily regulation runs ahead of those moments rather than only reacting to
                  them, and whether some conversational moves (a change of topic, a pause, a laugh) are themselves regulation, preceded by a
                  shift in internal state and followed by a return toward baseline.
                </p>
              </TopicDetails>
            </li>

            <li>
              <TopicDetails title={researchTrails[2].title} question={researchTrails[2].question} large>
                <p>
                  Conversation partners drift in and out of alignment across many timescales, and the structure of that drift (pink noise in
                  the path of what they talk about) predicts how much they enjoy a conversation and feel connected (
                  <Link href={researchSources.onell2026.href}>{researchSources.onell2026.label}</Link>). I ask whether partners&apos;
                  internal states couple the same way, and whether that structure, rather than simple synchrony, tracks enjoyment and connection: evidence
                  that a conversation is more than two independent speakers.
                </p>
              </TopicDetails>
            </li>
          </ul>

          <p>
            Currently, I work in Brown&apos;s{" "}
            <Link href="https://copsy.brown.edu">Department of Cognitive and Psychological Sciences</Link> and the{" "}
            <Link href="https://carney.brown.edu">Carney Institute for Brain Science</Link>, with{" "}
            <Link href="https://fpetzschner.com/about/">Frederike Petzschner</Link> and her team in the{" "}
            <Link href="https://fpetzschner.com/lab/">Psychiatry, Embodiment and Computation (PEAC) Lab</Link>. My{" "}
            timeline below shows where else I&apos;ve worked toward these questions.
          </p>
      </section>

      <section id="timeline" aria-labelledby="timeline-title" className="scroll-mt-6">
        <h2 id="timeline-title">Timeline</h2>
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
              <p className="mb-0 ml-5 border-l border-stone-200 pl-4 dark:border-stone-700">
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
      </section>
    </ScienceShell>
  );
}
