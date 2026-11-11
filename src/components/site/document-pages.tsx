import Image from "next/image";
import pages from "../../../content/cv-pages.json";

type Page = { src: string; width: number; height: number };

// The CV or the resume, page by page, printed on the site's sand paper (scripts/cv_pages.py renders the PDFs). By
// day the pages sit in the paper itself, a hairline between them; at night each is a print.
export function DocumentPages({ document, title }: { document: "cv" | "resume"; title: string }) {
  const list = ((pages as Record<string, Page[]>)[document] ?? []);
  return (
    <div className="not-prose grid gap-6">
      {list.map((page, index) => (
        <Image
          key={page.src}
          src={page.src}
          alt={`${title}, page ${index + 1} of ${list.length}`}
          width={page.width}
          height={page.height}
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="document-page h-auto w-full"
          priority={index === 0}
        />
      ))}
    </div>
  );
}
