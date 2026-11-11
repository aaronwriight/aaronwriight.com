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
  photo?: { src: string; alt: string; width: number; height: number };
  preview?: React.ReactNode;
  linkLabel?: string;
  headingLevel?: "h2" | "h3";
};

export function ProjectPlacard({ category, title, subtitle, description, href, image, alt = "", photo, preview, linkLabel = "explore project", headingLevel: Heading = "h2" }: ProjectPlacardProps) {
  // A photograph sets its own column: it keeps its shape and fills it, so neither orientation leaves a margin around it.
  const columns = photo ? "lg:grid-cols-[auto_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]";
  // The placard is a print, like the photographs (.print-placard in globals.css): warm white border, rounded corners, a
  // little lift off the paper; its picture is a print within it.
  const className = `project-placard print-placard grid gap-6 p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal sm:p-6 ${columns} lg:gap-8`;
  const content = (
    <>
      {photo ? (
        <div className="print max-w-full lg:h-64" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 400px, 90vw" className="h-full w-full object-cover" />
        </div>
      ) : preview ? <div className="flex min-w-0 flex-col justify-center">{preview}</div> : image ? (
        <div className="flex min-w-0 flex-col justify-center">
          {/* The picture as a single print: a warm white border and a soft shadow, the figure straight inside it. At night
              the picture's white is dimmed, because most figures have a white ground drawn in. */}
          <div className="print h-56">
            <div className="relative h-full overflow-hidden bg-white dark:brightness-[0.88]">
              <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 440px, (min-width: 768px) 60vw, 90vw" className="object-contain p-1" />
            </div>
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
        {href && <span className="project-placard-highlight mt-5 text-xs text-olive transition-colors">{linkLabel}</span>}
      </div>
    </>
  );

  return (
    <article>
      {href ? (
        <Link href={href} aria-label={`${title}, ${linkLabel}`} className={className}>{content}</Link>
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
