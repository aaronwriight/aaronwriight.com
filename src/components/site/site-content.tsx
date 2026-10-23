import Link from "next/link";
import { NavigationList } from "@/components/site/navigation-list";
import { siteLinks, sectionLinks, type NavigationItem } from "@/data/navigation";

const contentMaxWidth = "64rem";

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
  return (
    <main className="container mx-auto flex-1 px-6 py-11">
      <div className="grid items-start gap-y-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-16">
        <SiteMenu />
        <article
          className="prose prose-stone min-w-0 w-full max-w-none self-start text-left text-sm dark:prose-invert prose-headings:font-serif prose-headings:lowercase prose-a:text-olive prose-h2:text-sm prose-h2:font-medium prose-h2:tracking-normal prose-h2:normal-case"
          style={{ maxWidth: contentMaxWidth }}
        >
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
  return (
    <main className="container mx-auto flex-1 px-6 py-11">
      <div className="grid items-start gap-y-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-16">
        <SectionMenu title={section} links={links} parentLinks={parentLinks} />
        <article
          className="prose prose-stone min-w-0 w-full max-w-none self-start text-left text-sm dark:prose-invert prose-headings:font-serif prose-headings:lowercase prose-a:text-olive prose-h2:text-sm prose-h2:font-medium prose-h2:tracking-normal prose-h2:normal-case"
          style={{ maxWidth: contentMaxWidth }}
        >
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
