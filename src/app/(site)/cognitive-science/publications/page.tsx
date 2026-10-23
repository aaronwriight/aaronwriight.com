import type { Metadata } from "next";
import { ExternalLink, ScienceShell } from "@/components/science/science-content";
import { PublicationLinks } from "@/components/science/publication-links";

export const metadata: Metadata = {
  title: "publications",
  description: "Publications, posters, and presentations by Aaron Wright",
};

export default function PublicationsPage() {
  return (
    <ScienceShell title="publications">
      <p>
        These lists are updated periodically. You can also find my articles on{" "}
        <ExternalLink href="https://scholar.google.com/citations?user=2b1N4FcAAAAJ&hl=en">Google Scholar</ExternalLink>.
      </p>

      <section>
        <p className="m-0 font-medium">papers</p>
        <ul>
          <li>
            <p>
              Wolna, A., <strong>Wright, A.</strong>, Casto, C., Hutchinson, S., Lipkin, B., & Fedorenko, E. (2026). The extended language
              network: Language-responsive brain areas whose contributions to language remain to be discovered. <em>The Journal of Neuroscience.</em>
            </p>
            <PublicationLinks
              links={[
                {
                  label: "DOI",
                  href: "https://doi.org/10.1523/JNEUROSCI.0638-25.2026",
                },
                {
                  label: "PDF",
                  href: "https://www.jneurosci.org/content/jneuro/early/2026/06/24/JNEUROSCI.0638-25.2026.full.pdf",
                },
                {
                  label: "OSF",
                  href: "https://osf.io/7594t/",
                },
                {
                  label: "Press",
                  href: "https://mcgovern.mit.edu/2026/07/01/the-brains-language-network-is-more-extensive-than-previously-thought/",
                },
              ]}
            >
              {/* The published abstract (doi:10.1523/JNEUROSCI.0638-25.2026). */}
              <p>
                Although language neuroscience has largely focused on “core” left frontal and temporal brain areas and their right-hemisphere
                homotopes, numerous other areas—cortical and subcortical—have been implicated in linguistic processing. However, these areas’
                contributions to language remain unclear given that the evidence for their recruitment comes from diverse paradigms, many of which
                conflate language processing with perceptual, motor, or task-related cognitive processes. Using fMRI data from 772 participants (438
                females, 334 males) performing an extensively validated language “localizer” paradigm that isolates language processing from other
                processes, we (1) delineate a comprehensive set of areas that respond reliably to language across written and auditory modalities and
                (2) evaluate these areas’ selectivity for language relative to a demanding nonlinguistic task. In line with prior claims, many areas
                outside the core fronto-temporal network respond during language processing, and most of them show selectivity for language relative
                to general task demands. These language-selective areas of the extended language network include areas around the temporal poles, in
                the medial frontal cortex, in the hippocampus, and in the cerebellum, among others. Although distributed across many parts of the
                brain, the extended language-selective network still only comprises a small fraction ({"<"}5%) of the gray matter volume, challenging
                the view that the entire brain processes language. These newly identified language-selective areas can now be systematically
                characterized to decipher their contributions to language processing, including testing whether these contributions differ from
                those of the core language areas.
              </p>
            </PublicationLinks>
          </li>
          <li>
            <p>
              Iltis, P. W., Frahm, J., Voit, D., <strong>Wright, A.</strong>, & Dever, A. (2024). A descriptive comparison of oral cavity movements
              between brass instrumentalists performing large interval slurs. <em>Medical Problems of Performing Artists, 39</em>(4), 169-176.
            </p>
            <PublicationLinks
              links={[
                {
                  label: "DOI",
                  href: "https://doi.org/10.21091/mppa.2024.04020",
                },
                {
                  label: "PubMed",
                  href: "https://pubmed.ncbi.nlm.nih.gov/39641566/",
                },
              ]}
            >
              {/* The published abstract (doi:10.21091/mppa.2024.04020). */}
              <p>
                OBJECTIVE: We have previously described patterns of oral cavity movement in advanced French horn players during the performance of
                large interval slurs. The current study expands upon that work by reporting comparisons between horn, trumpet, and trombone players
                performing similar large interval exercises.
              </p>
              <p>
                METHODS: Real-time MRI (RT-MRI) films at 20 msec resolution were simultaneously obtained in the sagittal and coronal planes in 10
                trumpet players, 9 horn players, and 10 trombone players as they performed 2 repetitions each of slur sequences spanning 1 octave and
                1 octave + 3rd (interval of a tenth) at a mezzo forte dynamic level. Nine profile lines were overlaid on the sagittal images allowing
                the measurement of dorsal tongue edge movement using a customized MATLAB toolkit. Image J (FIJI) was utilized to measure the
                cross-sectional area formed between the dorsal edge of the tongue and the hard palate as depicted in coronal images.
              </p>
              <p>
                RESULTS: In horn and trumpet players, but not in trombone players, sagittal and coronal views demonstrate patterned tongue movements
                that narrow and widen the air channel during ascending and descending slurs, respectively. The magnitude of these movements is
                greater during larger intervals, though not perfectly consistent within each slur sequence. The sagittal views revealed these
                patterns to be most prominent in the anterior oral cavity rather than the middle and posterior oral cavity across all instruments.
              </p>
              <p>
                CONCLUSION: Conformational changes of the oral cavity (vocal-tract tuning) during large interval slurs in the upper register may
                assist performance in trumpet and horn players. Trombone players may also employ these strategies when the extreme upper register is
                involved, but future study must verify this.
              </p>
            </PublicationLinks>
          </li>
        </ul>
      </section>

      <section>
        <p className="m-0 font-medium">posters & presentations</p>
        <ul>
          <li>
            Wolna, A., <strong>Wright, A.</strong>, Casto, C., Lipkin, B., & Fedorenko, E. (2025, March). The extended language network: Language
            selective brain areas whose contributions to language remain to be discovered. <em>McGovern Travel & Technology Awards Poster Session,
            Cambridge, MA.</em>{" "}
            <ExternalLink href="https://aaronwriight.github.io/files/posters/Wolna.Agata.Wright.Aaron_v2%20copy.pdf">PDF</ExternalLink>
          </li>
          <li>
            Wolna, A., <strong>Wright, A.</strong>, Wodniecka, Z., & Fedorenko. (2025, April). From Words to Stories: Engagement of
            language-specific and domain-general neural mechanisms in native and second language comprehension.{" "}
            <em>Annual Meeting of the Cognitive Neuroscience Society, Boston, MA.</em>{" "}
            <ExternalLink href="https://aaronwriight.github.io/files/posters/CNS_2025_poster%20copy.pdf">PDF</ExternalLink>
          </li>
        </ul>
      </section>
    </ScienceShell>
  );
}
