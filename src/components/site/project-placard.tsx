import Image from "next/image";
import Link from "next/link";

type ProjectPlacardProps = {
  category: string;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  image?: string;
  alt?: string;
  headingLevel?: "h2" | "h3";
};

export function ProjectPlacard({ category, title, subtitle, description, href, image, alt = "", headingLevel: Heading = "h2" }: ProjectPlacardProps) {
  const className = "project-placard grid gap-6 border border-stone-300 p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f8200] sm:p-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-8 dark:border-stone-700";
  const content = (
    <>
      {image ? (
        <div className="flex min-w-0 flex-col justify-center">
          <div className="relative h-56 overflow-hidden bg-white">
            <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 440px, (min-width: 768px) 60vw, 90vw" className="object-contain p-2" />
          </div>
        </div>
      ) : (
        <div aria-hidden="true" className="hidden h-56 lg:block" />
      )}
      <div className="flex flex-col justify-center py-1">
        <p className="m-0 text-[0.65rem] uppercase tracking-[0.18em] text-stone-500">{category}</p>
        <Heading className="project-placard-highlight mb-3 mt-2 font-serif text-[1.4rem] font-normal leading-tight transition-colors">{title}</Heading>
        {subtitle && <p className="project-placard-highlight m-0 font-serif text-sm italic leading-relaxed transition-colors">{subtitle}</p>}
        {description && <p className="mb-0 mt-3 text-sm leading-relaxed text-stone-500">{description}</p>}
        {href && <span className="project-placard-highlight mt-5 text-xs text-[#6f8200] transition-colors dark:text-[#b0bf59]">explore project <span aria-hidden="true">→</span></span>}
      </div>
    </>
  );

  return (
    <article>
      {href ? (
        <Link href={href} aria-label={`Explore ${title}`} className={className}>{content}</Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </article>
  );
}

export function ProjectGroup({ id, title, description, projects }: {
  id: string;
  title: string;
  description: string;
  projects: ProjectPlacardProps[];
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="not-prose space-y-5">
      <header>
        <h2 id={`${id}-heading`} className="m-0 font-serif text-sm font-medium lowercase tracking-widest">{title}</h2>
        <p className="mb-0 mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">{description}</p>
      </header>
      <div className="space-y-6">
        {projects.map((project) => <ProjectPlacard key={project.title} {...project} headingLevel="h3" />)}
      </div>
    </section>
  );
}
