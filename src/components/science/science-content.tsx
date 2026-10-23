import Link from "next/link";
import { PageHeader, SectionMenu } from "@/components/site/site-content";

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
  return (
    <main className="container mx-auto flex-1 px-6 py-11">
      <div className="grid items-start gap-y-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-16">
        <SectionMenu title="cognitive science" links={scienceLinks} parentLinks={parentLinks} />

        <article
          className="prose prose-stone min-w-0 w-full max-w-none self-start text-left text-sm dark:prose-invert prose-headings:font-serif prose-headings:lowercase prose-a:text-olive prose-h2:text-sm prose-h2:font-medium prose-h2:tracking-normal prose-h2:normal-case"
          style={{ maxWidth: "56rem" }}
        >
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
