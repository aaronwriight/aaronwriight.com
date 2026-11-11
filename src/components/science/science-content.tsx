import Link from "next/link";
import { SectionBar } from "@/components/site/site-bars";
import { PageHeader, articleClass } from "@/components/site/site-content";

import { scienceLinks } from "@/data/navigation";

export function ScienceShell({
  title,
  subtitle,
  parentLinks,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  parentLinks?: string[][];
  children: React.ReactNode;
}) {
  // Breadcrumbs, as in the creative bars: a project's page reads "cognitive science / projects".
  const near = (parentLinks ?? []).find(([, href]) => href !== "/");
  return (
    <main className="flex-1">
      <SectionBar section="cognitive science" href="/cognitive-science" links={scienceLinks} trail={near ? [near[0], near[1]] : undefined} current={title} />
      <div className="site-wrap py-11">
        <article className={articleClass} style={{ maxWidth: "56rem" }}>
          <PageHeader title={title} subtitle={subtitle} accent={title === "resources"} />
          <div className="mt-8 space-y-5">{children}</div>
        </article>
      </div>
    </main>
  );
}

export function ProjectShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ScienceShell title={title} subtitle={subtitle} parentLinks={[["projects", "/cognitive-science/projects"], ["home", "/"]]}>
      {children}
    </ScienceShell>
  );
}

export function TopicDetails({
  title,
  question,
  children,
}: {
  title: string;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details>
      <summary className="group cursor-pointer list-none">
        <strong>
          <em>{title}</em>
        </strong>{" "}
        <em className="text-stone-400">|</em>{" "}
        <span className="text-olive group-hover:underline">
          <em>{question}</em>
        </span>
      </summary>
      <div className="mt-3 pl-5">{children}</div>
    </details>
  );
}

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  );
}
