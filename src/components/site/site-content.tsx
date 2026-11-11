import Link from "next/link";
import { NavigationList } from "@/components/site/navigation-list";
import { SectionBar } from "@/components/site/site-bars";
import { siteLinks, sectionLinks, type NavigationItem } from "@/data/navigation";

const contentMaxWidth = "64rem";

// The article column, centred under the bars.
export const articleClass = "prose prose-stone mx-auto min-w-0 w-full max-w-none text-left text-sm dark:prose-invert prose-headings:font-serif prose-headings:lowercase prose-a:text-olive prose-h2:text-sm prose-h2:font-medium prose-h2:tracking-normal prose-h2:normal-case";

// Where each section's name in its bar leads.
export const sectionHomes: Record<string, string> = {
  "cognitive science": "/cognitive-science",
  creative: "/creative",
  "scope for imagination": "/scope-for-imagination",
  venture: "/venture",
  literature: "/literature",
  wiki: "/about",
};

const creativeParentLinks = [
  ["projects", "/creative/projects"],
  ["home", "/"],
];

export function SitePageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  // The site bar in the header names every world, so these pages need no menu of their own.
  return (
    <main className="flex-1">
      <div className="site-wrap py-11">
        <article className={articleClass} style={{ maxWidth: contentMaxWidth }}>
          <PageHeader title={title} subtitle={subtitle} />
          <div className="mt-8 space-y-5">{children}</div>
        </article>
      </div>
    </main>
  );
}

export function PageHeader({
  title,
  subtitle,
  accent = false,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <header className="not-prose border-b border-stone-300 pb-5 dark:border-stone-700">
      <h1 className={`${accent ? "section-title " : ""}m-0 font-serif text-base font-medium lowercase tracking-widest text-stone-900 dark:text-stone-100`}>
        {title}
      </h1>
      {subtitle ? (
        <p className="m-0 mt-2 font-serif text-sm leading-6 text-stone-500">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

export function SiteMenu() {
  return (
    <aside className="space-y-5">
      <span className="block lowercase tracking-widest">
        home
      </span>
      <nav aria-label="Home pages">
        <NavigationList items={siteLinks} />
      </nav>
    </aside>
  );
}

export function SectionMenu({
  title,
  links,
  parentLinks = [["home", "/"]],
}: {
  title: string;
  links: NavigationItem[];
  parentLinks?: string[][];
}) {
  return (
    <aside className="space-y-5">
      <span className="block lowercase tracking-widest">
        {title}
      </span>
      {links.length > 0 && <nav aria-label={`${title} pages`}>
        <NavigationList items={links} />
      </nav>}
      <nav aria-label="Parent sections" className="flex flex-col items-start gap-1 text-xs lowercase tracking-wider text-stone-500">
        {parentLinks.map(([label, href]) => (
          <Link key={href} href={href} className="whitespace-nowrap">
            <span aria-hidden="true">← </span>{label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function SectionPageShell({
  section,
  links,
  parentLinks,
  title,
  subtitle,
  showTitle = true,
  children,
}: {
  section: string;
  links: NavigationItem[];
  parentLinks?: string[][];
  title: string;
  subtitle?: React.ReactNode;
  showTitle?: boolean;
  children: React.ReactNode;
}) {
  // The section's own bar (its name, its pages, sub-pages as drop-downs) sits under the site bar, in place of the side
  // menu. Parent links become breadcrumbs: a creative project's sections show "creative /" before their name, and a
  // page one level down (a back link such as "northeast 115") shows after it.
  const parents = (parentLinks ?? []).filter(([, href]) => href !== "/");
  const inCreative = section !== "creative" && parents.some(([, href]) => href === "/creative/projects");
  const parent: [string, string] | undefined = inCreative ? ["creative", "/creative"] : undefined;
  const near = parents.find(([, href]) => !(inCreative && href === "/creative/projects"));
  const trail: [string, string] | undefined = near ? [near[0], near[1]] : undefined;
  return (
    <main className="flex-1">
      {links.length > 0 && <SectionBar section={section} href={sectionHomes[section] ?? links[0].href} links={links} parent={parent} trail={trail} current={title} />}
      <div className="site-wrap py-11">
        <article className={articleClass} style={{ maxWidth: contentMaxWidth }}>
          {showTitle && <PageHeader title={title} subtitle={subtitle} />}
          <div className={showTitle ? "mt-8 space-y-5" : "space-y-5"}>{children}</div>
        </article>
      </div>
    </main>
  );
}

export function CreativeShell({ title = "about", children }: { title?: string; children: React.ReactNode }) {
  return (
    <SectionPageShell section="creative" links={sectionLinks.creative} title={title}>
      {children}
    </SectionPageShell>
  );
}

export function CreativeProjectShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SectionPageShell section="creative" links={sectionLinks.creative} parentLinks={creativeParentLinks} title={title}>
      {children}
    </SectionPageShell>
  );
}

export function PhotographyShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SectionPageShell section="Frame It Wright Photography" links={sectionLinks.photography} title={title} subtitle={subtitle}>
      {children}
    </SectionPageShell>
  );
}

export function JournalShell({
  title,
  subtitle,
  showTitle = true,
  years = [],
  backLink,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  showTitle?: boolean;
  years?: number[];
  backLink?: [string, string];
  children: React.ReactNode;
}) {
  const journalLinks: NavigationItem[] = [
    { label: "about", href: "/scope-for-imagination" },
    { label: "index", href: "/scope-for-imagination/index", children:
      years.map((year) => ({ label: String(year), href: `/scope-for-imagination/${year}` })),
    },
    { label: "mailing list", href: "/scope-for-imagination/mailing-list" },
  ];

  return (
    <SectionPageShell section="scope for imagination" links={journalLinks} parentLinks={backLink ? [backLink, ...creativeParentLinks] : creativeParentLinks} title={title} subtitle={subtitle} showTitle={showTitle}>
      {children}
    </SectionPageShell>
  );
}

export function VentureShell({
  title,
  subtitle,
  showTitle = true,
  backLink,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  showTitle?: boolean;
  backLink?: [string, string];
  children: React.ReactNode;
}) {
  return (
    <SectionPageShell section="venture" links={sectionLinks.venture} parentLinks={backLink ? [backLink, ...creativeParentLinks] : creativeParentLinks} title={title} subtitle={subtitle} showTitle={showTitle}>
      {children}
    </SectionPageShell>
  );
}

export function LiteratureShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SectionPageShell section="literature" links={sectionLinks.literature} parentLinks={creativeParentLinks} title={title} subtitle={subtitle}>
      {children}
    </SectionPageShell>
  );
}

export function ContactShell({
  title,
  subtitle,
  showTitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  showTitle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <SectionPageShell section="contact" links={sectionLinks.contact} title={title} subtitle={subtitle} showTitle={showTitle}>
      {children}
    </SectionPageShell>
  );
}

export function WikiShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SectionPageShell section="wiki" links={sectionLinks.wiki} title={title} subtitle={subtitle}>
      {children}
    </SectionPageShell>
  );
}

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <SitePageShell title={title} subtitle="coming soon">
      {null}
    </SitePageShell>
  );
}
