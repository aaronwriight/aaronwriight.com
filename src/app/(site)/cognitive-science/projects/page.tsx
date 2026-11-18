import type { Metadata } from "next";
import { ProjectGroup } from "@/components/site/project-placard";
import { ScienceShell } from "@/components/science/science-content";

export const metadata: Metadata = {
  title: "projects",
  description: "Research, scientific software, and data visualization projects by Aaron Wright",
};

const projects = [
  {
    category: "research",
    title: "the extended language network",
    href: "/cognitive-science/projects/extended-language-network",
    subtitle: "language-selective brain areas whose contributions to language remain to be discovered.",
    description: "Looking beyond the familiar frontal and temporal areas to explore the broader landscape of language-selective brain regions.",
    // The brain, trimmed of the original's wide white margin, so the print takes its shape.
    photo: {
      src: "/images/projects/extended-language-network/brain.png",
      alt: "A cortical surface illustration with language-responsive regions shaded in warm tones.",
      width: 2400,
      height: 1724,
    },
  },
  {
    category: "software",
    title: "cortex",
    href: "/cognitive-science/projects/cortex",
    subtitle: "a modular ecosystem for multimodal neuroimaging analysis.",
    description: "Making neuroscience workflows more consistent, reproducible, and approachable.",
    // The card's contour ground runs to its edges, so the print takes the card's shape.
    photo: {
      src: "/images/projects/cortex-social-card.png",
      alt: "Cortex artwork: a brain with language regions shaded in orange, ringed by its workflow (preprocess, segment, model, map, analyze, visualize), on contour lines.",
      width: 2560,
      height: 1440,
    },
  },
  {
    category: "creative",
    title: "tidy tuesday",
    href: "/cognitive-science/projects/tidy-tuesday",
    subtitle: "experiments in communicating patterns through data",
    description: "For now, a visualization from an undergraduate project exploring Twitter sentiment.",
    // The chart is drawn on its own white ground, so its print takes the chart's shape rather than holding it in a box.
    photo: {
      src: "/images/projects/tidy-tuesday/twitter-sentiment.png",
      alt: "An annotated bar chart of hourly AFINN sentiment scores for tweets about Twitter’s free-speech policies, alongside Elon Musk’s Twitter activity.",
      width: 2400,
      height: 1800,
    },
  },
];

const groups = [
  { id: "research", title: "research", description: "Work on language, cognition, and the brain." },
  { id: "software", title: "software", description: "Tools for working with neuroscience data." },
  { id: "creative", title: "creative", description: "Experiments with data visualization and scientific communication." },
];

export default function CognitiveScienceProjectsPage() {
  return (
    <ScienceShell title="projects">
      <div className="space-y-12">
        {groups.map((group) => <ProjectGroup key={group.id} {...group} projects={projects.filter((project) => project.category === group.id)} />)}
      </div>
    </ScienceShell>
  );
}
