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
    image: "/images/projects/extended-language-network.png",
    alt: "A cortical surface illustration with language-responsive regions shaded in warm tones.",
  },
  {
    category: "software",
    title: "cortex",
    href: "/cognitive-science/projects/cortex",
    subtitle: "the tidyverse for computational neuroscience.",
    description: "A modular ecosystem for making neuroscience workflows more consistent, reproducible, and approachable.",
    image: "/images/projects/cortex.png",
    alt: "Cortex artwork showing a neuroscience workflow from preprocessing through modeling, mapping, and visualization.",
  },
  {
    category: "creative",
    title: "tidy tuesday",
    href: "/cognitive-science/projects/tidy-tuesday",
    subtitle: "experiments in communicating patterns through data",
    description: "For now, a visualization from an undergraduate project exploring Twitter sentiment.",
    image: "/images/projects/tidy-tuesday.png",
    alt: "An annotated bar chart of hourly AFINN sentiment scores for tweets about Twitter’s free-speech policies, alongside Elon Musk’s Twitter activity.",
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
