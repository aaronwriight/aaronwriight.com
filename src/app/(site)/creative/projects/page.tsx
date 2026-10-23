import type { Metadata } from "next";
import { CreativeShell } from "@/components/site/site-content";
import { ProjectGroup } from "@/components/site/project-placard";

export const metadata: Metadata = {
  title: "projects | creative",
  description: "Journals, travel, and literature by Aaron Wright.",
  alternates: { canonical: "/creative/projects" },
};

const groups = [
  {
    id: "notes-and-travel",
    title: "notes & travel",
    description: "Scope for Imagination holds my journal entries; Venture keeps track of trips, trails, and places.",
    projects: [
      {
        category: "digital journal",
        title: "scope for imagination",
        subtitle: "photographs, reflections, life updates, and the occasional rant",
        href: "/scope-for-imagination",
      },
      {
        category: "travel",
        title: "venture",
        subtitle: "a field journal for peaks, parks, and places worth remembering",
        href: "/venture",
        image: "/images/projects/venture-atlas.png",
        alt: "A still of the Venture atlas globe, with visited countries highlighted in green.",
      },
    ],
  },
  {
    id: "literature",
    title: "literature",
    description: "A longer writing project, still in progress.",
    projects: [
      {
        category: "literature",
        title: "sand dollar hunting",
        subtitle: "coming soon",
        image: "/sand_dollar_cutout.png",
        alt: "The sand dollar logo.",
      },
    ],
  },
];

export default function CreativeProjectsPage() {
  return (
    <CreativeShell title="projects">
      <div className="space-y-12">
        {groups.map((group) => <ProjectGroup key={group.id} {...group} />)}
      </div>
    </CreativeShell>
  );
}
