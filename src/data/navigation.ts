import { resourceSections } from "@/data/readings-resources";

export type NavigationItem = {
  label: string;
  href: string;
  children?: NavigationItem[];
};

export const creativeProjects: NavigationItem[] = [
  { label: "scope for imagination", href: "/scope-for-imagination" },
  { label: "venture", href: "/venture" },
  { label: "sand dollar hunting", href: "/literature/sand-dollar-hunting" },
];

export const scienceLinks: NavigationItem[] = [
  { label: "about", href: "/cognitive-science/about", children: [
    { label: "research overview", href: "/cognitive-science/about#research-overview" },
    { label: "timeline", href: "/cognitive-science/about#timeline" },
  ] },
  { label: "projects", href: "/cognitive-science/projects", children: [
    { label: "the extended language network", href: "/cognitive-science/projects/extended-language-network" },
    { label: "cortex", href: "/cognitive-science/projects/cortex" },
    { label: "tidy tuesday", href: "/cognitive-science/projects/tidy-tuesday" },
  ] },
  { label: "publications", href: "/cognitive-science/publications" },
  { label: "resources", href: "/cognitive-science/readings-resources", children: [
    { label: "articles", href: "/cognitive-science/readings-resources#articles" },
    ...resourceSections.map(({ title, id }) => ({ label: title.toLowerCase(), href: `/cognitive-science/readings-resources#${id}` })),
  ] },
  { label: "mentorship", href: "/cognitive-science/mentorship" },
  { label: "collaborators", href: "/cognitive-science/collaborators" },
  { label: "cv", href: "/files/cv/WrightAaron_cv_2026_current.pdf" },
];

export const sectionLinks: Record<string, NavigationItem[]> = {
  creative: [
    { label: "about", href: "/creative" },
    { label: "projects", href: "/creative/projects", children: creativeProjects },
    { label: "inspirations", href: "/creative/inspirations", children: [
      { label: "art & media", href: "/creative/inspirations#art" },
      { label: "communities", href: "/creative/inspirations#communities" },
      { label: "creative initiatives & inspirations", href: "/creative/inspirations#inspirations" },
    ] },
    { label: "mailing list", href: "/creative/mailing-list" },
  ],
  photography: [
    { label: "about", href: "/frame-it-wright-photography" },
    { label: "portfolio", href: "/frame-it-wright-photography/portfolio" },
    { label: "gallery", href: "/frame-it-wright-photography/gallery" },
    { label: "booking", href: "/frame-it-wright-photography/booking" },
  ],
  literature: [
    { label: "about", href: "/literature" },
    { label: "projects", href: "/creative/projects#literature", children: creativeProjects.filter(({ href }) => href.startsWith("/literature/")) },
  ],
  contact: [],
  venture: [
    { label: "about", href: "/venture/about" },
    { label: "atlas", href: "/venture" },
    { label: "index", href: "/venture/index", children: [
      { label: "northeast 115", href: "/venture/trails" },
      { label: "national parks", href: "/venture/parks" },
      { label: "travels", href: "/venture/travels" },
    ] },
  ],
  wiki: [
    { label: "about", href: "/about" },
    { label: "software & platforms", href: "/about/platforms" },
  ],
};

export const siteLinks: NavigationItem[] = [
  { label: "cognitive science", href: "/cognitive-science", children: scienceLinks },
  { label: "frame it wright photography", href: "/frame-it-wright-photography", children: sectionLinks.photography },
  { label: "creative", href: "/creative", children: sectionLinks.creative },
  { label: "contact", href: "/contact" },
];
