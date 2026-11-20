import type { Metadata } from "next";
import { ProjectShell } from "@/components/science/science-content";
import { ProjectFigure } from "@/components/science/project-figure";
import { Note, NoteGrid } from "@/components/science/project-notes";

export const metadata: Metadata = {
  title: "cortex",
  description: "A modular ecosystem for multimodal neuroimaging analysis.",
  // The Cortex card (November 2026) is also the link preview for this page.
  openGraph: { images: [{ url: "/images/projects/cortex-social-card.png", width: 2560, height: 1440, alt: "Cortex: a modular ecosystem for multimodal neuroimaging analysis." }] },
  twitter: { card: "summary_large_image", images: ["/images/projects/cortex-social-card.png"] },
};

const icon = (name: string) => ({ src: `/images/projects/cortex/icon-${name}.svg` });

export default function CortexProjectPage() {
  return (
    <ProjectShell title="cortex" subtitle="a modular ecosystem for multimodal neuroimaging analysis.">
      <p>
        Cortex is a modular ecosystem for computational neuroscience, built around a shared approach to data, analysis, and visualization.
        The aim is to make scientific workflows easier to follow, compose, and reproduce.
      </p>
      <ProjectFigure
        src="/images/projects/cortex-social-card.png"
        alt="Cortex artwork: a brain with language regions shaded in orange, ringed by its workflow (preprocess, segment, model, map, analyze, visualize), on contour lines."
        caption="The Cortex workflow, illustrated."
        width={2560}
        height={1440}
      />

      <h2>in brief</h2>
      <p>
        A neuroimaging analysis usually passes through a handful of tools, each with its own conventions, and somewhere along the way it gets hard
        to say exactly what was done to the data. Cortex is a Python package for EEG and fMRI that writes every step the same way and keeps a record
        of how each result was made, so that an analysis can be read, checked, and run again.
      </p>
      <p>Every step, in either modality, has the same shape:</p>
      <pre className="not-prose overflow-x-auto rounded border border-stone-300/60 bg-paper-tint p-4 font-mono text-xs leading-relaxed dark:border-stone-700">
        <code>result = operation(data, cfg=cfg, params=params)</code>
      </pre>
      <p>
        The scientific choices (a filter cutoff, an epoch window, a contrast) live in <em>params</em>; the practical ones (where outputs go, how
        much to print) live in <em>cfg</em>. Keeping them apart means changing where results are saved can never quietly change the science. Each
        result carries its outputs alongside a short log of what ran, and steps chain into pipelines that can be previewed and checked before
        anything runs.
      </p>

      <h2>six modules</h2>
      <p>
        Every step belongs to one of six modules. They form a cycle rather than a line: you can start wherever your data are ready and take a
        result out of any of them.
      </p>
      <NoteGrid columns={3}>
        <Note icon={icon("preprocess")} kicker="01" title="preprocess">
          Filtering, line noise, ICA for blinks and eye movements; slice timing, motion correction, and alignment to anatomy.
        </Note>
        <Note icon={icon("segment")} kicker="02" title="segment">
          Epochs around each event in EEG; tissues, cortical surfaces, and atlas regions in fMRI.
        </Note>
        <Note icon={icon("model")} kicker="03" title="model">
          Event-related potentials and spectra in EEG; general linear models in the volume or on the cortical surface in fMRI.
        </Note>
        <Note icon={icon("map")} kicker="04" title="map">
          Functional regions of interest defined in each participant, group-constrained parcels, subcortex and cerebellum.
        </Note>
        <Note icon={icon("analyze")} kicker="05" title="analyze">
          ERP contrasts, combining runs, held-out fROI responses, localizer reliability, pattern similarity, group tests.
        </Note>
        <Note icon={icon("visualize")} kicker="06" title="visualize">
          Maps drawn on the brain's own cortex, cerebellar flat maps, scalp maps, and spectra, each saved with a record of the data it shows.
        </Note>
      </NoteGrid>
      <p>
        Cortex is built with functional localizers and individual brains in mind, from subject-specific fROIs to surface-based models and
        lesioned anatomy. It reads SPM, CONN, and EEGLAB output without MATLAB and can call those tools when MATLAB is installed, so it fits into
        pipelines labs already have. It never discards data on its own: components and trials are reviewed before anything is rejected. Each
        modality has a tutorial notebook that walks through all six modules on open data from OpenNeuro.
      </p>

      <h2>where it stands</h2>
      <p>
        Cortex is experimental and in active development. On the fMRI side it handles design checks, first-level models, regions of interest, and
        surface-based work; on the EEG side, preprocessing through condition averages, spectra, and time&ndash;frequency analysis. Voxelwise group
        models, connectivity, decoding, and multimodal methods are still to come.
      </p>
    </ProjectShell>
  );
}
