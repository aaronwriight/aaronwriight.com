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
        caption="The canonical language network, shown on the Glasser multimodal parcellation."
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

      <h2>background</h2>
      <p>
        Language reliably engages a left-lateralized network of frontal and temporal areas that supports comprehension and production, whether
        the input is read or heard. Over the years, many other structures have also been tied to language: medial frontal cortex, the temporal
        poles, ventral temporal and parietal areas, the hippocampus, the basal ganglia, the thalamus, and the cerebellum. That evidence is hard to
        weigh. Much of it comes from single paradigms that mix language with perception, movement, or the general effort of doing a task, and
        from group-averaged maps, which blur over real differences in where functional areas sit in each person&rsquo;s brain. Two studies
        reporting nearby peaks may not have found the same area at all.
      </p>

      <h2>methods</h2>
      <ProjectFigure
        src="/images/projects/extended-language-network/figure-1-tasks.png"
        alt="The three tasks. Reading: sentences and nonword lists shown one word at a time, 450 ms each, in 6-second trials. Listening: intact and degraded passages from Alice in Wonderland in 18-second trials. Spatial working memory: easy and hard sequences of squares flashed on a 3 by 4 grid, followed by a choice and feedback, in 8-second trials."
        caption="The three tasks: reading sentences versus nonwords, listening to intact versus degraded speech, and a hard versus easy spatial working-memory task."
        width={2000}
        height={1283}
        wrap="left"
      />
      <p>
        We drew on fMRI data from 772 participants, all of whom completed a well-validated reading localizer: sentences against lists of
        pronounceable nonwords, a contrast that isolates word meaning and sentence structure from the act of reading. A subset of 86 also listened
        to passages from <em>Alice in Wonderland</em> against acoustically degraded versions, and 489 completed a demanding spatial working-memory
        task.
      </p>
      <p>
        Rather than averaging brains, we used functional localization. Group-level parcels came from two sources: 27 parcels derived from the
        language data themselves, by overlaying the most language-responsive voxels of 706 participants and dividing the overlap map with a
        watershed algorithm (the group-constrained subject-specific approach), and, for comparison, four standard atlases: Desikan&ndash;Killiany&ndash;Tourville,
        Harvard&ndash;Oxford cortical and subcortical, and the Glasser multimodal parcellation. Within each parcel, each participant&rsquo;s
        functional region of interest was the 10% of voxels most responsive to language, chosen on one half of the data and measured on the other.
        Each region was then tested with linear mixed-effects models.
      </p>

      <h2>results</h2>
      <ProjectFigure
        src="/images/projects/extended-language-network/figure-3.png"
        alt="Brain surfaces and a cerebellar flat map with language parcels in red, each ringed by bar plots of responses to sentences, nonwords, intact and degraded speech, and hard and easy spatial working memory, with check marks for language-selective regions."
        caption="Responses in each language region: reds for reading and listening, blues for working memory; two checks mark a language-selective region."
        width={1250}
        height={1800}
        wrap="right"
        wide
      />
      <p>
        We counted a region as <em>language-responsive</em> if it preferred language in both modalities (sentences over nonwords, intact over
        degraded speech), and as <em>language-selective</em> if, in addition, its response to language exceeded its response to the hard
        working-memory task.
      </p>
      <p>
        Beyond the core frontal and temporal areas and their right-hemisphere counterparts, 17 areas responded to both written and spoken
        language: seven cortical, five cerebellar, and five subcortical. Most were selective for language, with little or no response to the
        working-memory task. They include both temporal poles, a left ventral temporal area, three medial frontal areas, an area in the left
        precuneus, areas in the right cerebellum with a mirror-image area on the left, and both the hippocampus and amygdala on each side.
      </p>
      <p>
        The atlases told a consistent story. Language-selective regions turned up in 20 of 72 parcels of the Desikan&ndash;Killiany&ndash;Tourville
        atlas, 42 of 96 in the Harvard&ndash;Oxford cortical atlas, and 95 of 380 in the Glasser parcellation, spanning frontal and temporal
        cortex in both hemispheres along with left precentral and inferior parietal areas. Subcortically, the hippocampi and amygdalae were
        language-selective, the left thalamus responded to language without being selective for it, and the basal ganglia showed no reliable
        response to language at all.
      </p>
      <p>
        For all its reach, the extended network is small: under 5% of the brain&rsquo;s grey matter.
      </p>

      {/* The discussion carries on beside the parcel figure, which runs longer than the results. */}
      <h2 className="beside-figure">discussion</h2>
      <p>
        A response to language across modalities, and not to a hard non-linguistic task, rules out perception and general effort as the
        explanation. What these areas actually compute is still open, which makes them well-defined targets for the kind of systematic work that
        has characterized the core network. The few areas that respond to language without being selective, in the cerebellum and thalamus, sit in
        structures often proposed as integrators, and may combine linguistic signals with information from elsewhere.
      </p>
      <p>
        The results also suggest caution about some earlier claims. Activation during a &ldquo;language task&rdquo; need not reflect language: in
        paradigms free of task demands, the basal ganglia did not respond, and occipital responses to reading did not carry over to listening.
        And while the network reaches into nearly every major part of the brain, within each part it occupies only a small, well-defined patch,
        which argues against the view that language is processed by the brain as a whole. Parcels built from functional data, rather than from
        anatomy, proved the better guide to finding those patches.
      </p>
      <p>
        The parcels are shared on <a href="https://osf.io/7594t/">OSF</a> in both volume and surface space, with the code and data to reproduce
        the analyses and figures in a <a href="https://github.com/aaronwriight/extended_language_network-osf">public repository</a>.
      </p>
    </ProjectShell>
  );
}
