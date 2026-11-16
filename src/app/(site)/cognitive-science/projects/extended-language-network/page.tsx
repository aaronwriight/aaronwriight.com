import type { Metadata } from "next";
import { ProjectShell } from "@/components/science/science-content";
import { PublicationLinks } from "@/components/science/publication-links";
import { ProjectFigure } from "@/components/science/project-figure";

export const metadata: Metadata = {
  title: "the extended language network",
  description: "Language-selective brain areas beyond the core frontal and temporal network, mapped in 772 participants.",
};

export default function ExtendedLanguageNetworkProjectPage() {
  return (
    <ProjectShell
      title="the extended language network"
      subtitle="language-selective brain areas whose contributions to language remain to be discovered."
    >
      <ProjectFigure
        src="/images/projects/extended-language-network/overview.png"
        alt="A cortical surface illustration with language-responsive regions shaded in warm tones."
        caption="A view of the broader cortical landscape motivating the extended language network project."
        width={1800}
        height={1293}
        wrap="left"
      />
      <p>
        Language neuroscience has largely focused on core left frontal and temporal areas, but many other cortical, subcortical, and cerebellar areas
        have been implicated in linguistic processing. This project asks which of those areas respond reliably and selectively to language, and what
        their contributions may be.
      </p>
      <p className="text-xs text-stone-500">
        Wolna, A., Wright, A., Casto, C., Hutchinson, S., Lipkin, B., &amp; Fedorenko, E. (2026). <em>The Journal of Neuroscience.</em>
      </p>
      <PublicationLinks
        links={[
          { label: "DOI", href: "https://doi.org/10.1523/JNEUROSCI.0638-25.2026" },
          { label: "PDF", href: "https://www.jneurosci.org/content/jneuro/early/2026/06/24/JNEUROSCI.0638-25.2026.full.pdf" },
          { label: "OSF", href: "https://osf.io/7594t/" },
          {
            label: "Press",
            href: "https://mcgovern.mit.edu/2026/07/01/the-brains-language-network-is-more-extensive-than-previously-thought/",
          },
        ]}
      >
        <p>
          Although language neuroscience has largely focused on &ldquo;core&rdquo; left frontal and temporal brain areas and their right-hemisphere
          homotopes, numerous other areas&mdash;cortical and subcortical&mdash;have been implicated in linguistic processing. However, these
          areas&rsquo; contributions to language remain unclear given that the evidence for their recruitment comes from diverse paradigms, many of
          which conflate language processing with perceptual, motor, or task-related cognitive processes. Using fMRI data from 772 participants (438
          females, 334 males) performing an extensively validated language &ldquo;localizer&rdquo; paradigm that isolates language processing from
          other processes, we (1) delineate a comprehensive set of areas that respond reliably to language across written and auditory modalities
          and (2) evaluate these areas&rsquo; selectivity for language relative to a demanding nonlinguistic task. In line with prior claims, many
          areas outside the core fronto-temporal network respond during language processing, and most of them show selectivity for language
          relative to general task demands. These language-selective areas of the extended language network include areas around the temporal
          poles, in the medial frontal cortex, in the hippocampus, and in the cerebellum, among others. Although distributed across many parts of
          the brain, the extended language-selective network still only comprises a small fraction (&lt;5%) of the gray matter volume, challenging
          the view that the entire brain processes language. These newly identified language-selective areas can now be systematically
          characterized to decipher their contributions to language processing, including testing whether these contributions differ from those
          of the core language areas.
        </p>
      </PublicationLinks>

      <h2>in brief</h2>
      <ProjectFigure
        src="/images/projects/extended-language-network/figure-1-tasks.png"
        alt="The three tasks. Reading: sentences and nonword lists shown one word at a time, 450 ms each, in 6-second trials. Listening: intact and degraded passages from Alice in Wonderland in 18-second trials. Spatial working memory: easy and hard sequences of squares flashed on a 3 by 4 grid, followed by a choice and feedback, in 8-second trials."
        caption="The localizers: reading sentences versus nonwords, listening to intact versus degraded speech, and a hard versus easy spatial working-memory task. Adapted from Wolna, Wright et al. (2026), CC BY."
        width={2000}
        height={1283}
        wrap="left"
      />
      <p>
        Areas well beyond the classic frontal and temporal language regions have been tied to language over the years, from the temporal poles to
        the cerebellum. But much of that evidence comes from tasks that mix language with reading letters, hearing sounds, moving, or simply
        working hard, and from group-averaged maps that blur over differences between individual brains. It has been hard to say which of these
        areas actually care about language.
      </p>
      <p>
        We took one consistent pass over the whole brain. All 772 participants read sentences and strings of nonwords, a contrast that isolates
        language from the act of reading. A subset also listened to intact and degraded passages from <em>Alice in Wonderland</em>, which let us keep
        only the areas that respond to language whether it is read or heard, and about 490 also did a demanding spatial working-memory task, which
        separates areas tuned to language from areas that respond to any hard task. Rather than averaging brains together, we found each
        person&rsquo;s own language-responsive region within group-level parcels, drawn both from the language data and from four standard
        atlases.
      </p>
      {/* The findings start below the localizer figure, beside the parcel figure. */}
      <div aria-hidden="true" className="clear-both" />
      <ProjectFigure
        src="/images/projects/extended-language-network/figure-3.png"
        alt="Brain surfaces and a cerebellar flat map with language parcels in red, each ringed by bar plots of responses to sentences, nonwords, intact and degraded speech, and hard and easy spatial working memory, with check marks for language-selective regions."
        caption="Responses in the core and extended language regions: reds for reading and listening, blues for the working-memory task; two checks mark a language-selective region. Adapted from Wolna, Wright et al. (2026), CC BY."
        width={1250}
        height={1800}
        wrap="right"
      />
      <p>
        The search turned up 17 areas outside the core network that respond to both written and spoken language, around the temporal poles, in
        medial frontal cortex, in the hippocampus, and in the cerebellum. Most of them are selective: like the core areas, they respond little to the
        working-memory task. A few, mostly in the cerebellum, respond to language without being selective for it, which may point to a role in
        integrating language with other information. And for all its reach, the extended network is small, under 5% of the brain&rsquo;s grey
        matter.
      </p>
      <p>
        These areas are now well-defined targets for asking what each one contributes to language, and whether it does something different from
        the core network. The parcels are shared on <a href="https://osf.io/7594t/">OSF</a> in both volume and surface space, with the code and data to
        reproduce the analyses and figures in a <a href="https://github.com/aaronwriight/extended_language_network-osf">public repository</a>.
      </p>
    </ProjectShell>
  );
}
