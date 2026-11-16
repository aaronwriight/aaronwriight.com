// Small placards for a project page, used sparingly: a grid of prints for steps that belong together (Cortex's modules).
// They share .print-placard with the project cards, so they read as the same family, only smaller and not links.
export function NoteGrid({ columns = 2, children }: { columns?: 2 | 3; children: React.ReactNode }) {
  const cols = columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return <div className={`not-prose my-6 grid gap-4 ${cols}`}>{children}</div>;
}

export function Note({ kicker, title, icon, children }: {
  kicker?: string;
  title: string;
  icon?: { src: string; alt?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="print-placard flex flex-col p-4">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG icons, nothing to optimise */}
        {icon && <img src={icon.src} alt={icon.alt ?? ""} width={40} height={40} className="h-10 w-10 shrink-0" />}
        <div className="min-w-0">
          {kicker && <p className="m-0 text-[0.6rem] uppercase tracking-[0.18em] text-stone-500">{kicker}</p>}
          <h3 className="mb-0 mt-1 font-serif text-lg font-normal leading-snug">{title}</h3>
        </div>
      </div>
      <div className="mt-2 text-[0.8rem] leading-relaxed text-stone-600 dark:text-stone-400">{children}</div>
    </div>
  );
}
