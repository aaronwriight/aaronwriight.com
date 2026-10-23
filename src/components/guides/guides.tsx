// ./components/Posts.tsx

import { SanityGuide } from "@/sanity/types/guides";
import { GuideThumbnail } from "./thumbnail";
import { SiteMenu } from "@/components/site/site-content";

function sortableGuideDate(guide: SanityGuide): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(guide.date_of_guide ?? "") ? guide.date_of_guide : "";
}

export default function Guides({ guides }: { guides: SanityGuide[] }) {
  const sortedGuides = [...guides].sort((first, second) => {
    const chronology = sortableGuideDate(second).localeCompare(sortableGuideDate(first));
    return chronology !== 0 ? chronology : second._id.localeCompare(first._id);
  });
  const dates = sortedGuides.map((item) => sortableGuideDate(item).slice(0, 4) || "undated");
  const uniqeYears = [...new Set(dates)];
  const groupedGuidesByYear: Array<{ year: string; items: SanityGuide[] }> =
    uniqeYears.map((el) => {
      return {
        year: el,
        items: sortedGuides.filter((item) => (sortableGuideDate(item).slice(0, 4) || "undated") === el),
      };
    });

  return (
    <main className="container relative mx-auto flex-1 px-7 py-12 sm:px-6 sm:py-11">
      <div className="grid items-start gap-y-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-16">
        <SiteMenu />
        <section className="w-full self-start space-y-8 text-left">
          {groupedGuidesByYear.map((year) => {
        return (
          <div
            key={`year-${year.year}`}
            className="flex flex-col gap-4 sm:flex-row sm:gap-8"
          >
            <h2 className="font-mono text-sm text-stone-500">
              {year.year}
            </h2>

            <div className="grid-cols grid flex-1 snap-center gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {year.items.map((guide) => {
                return (
                  <GuideThumbnail
                    key={guide._id}
                    title={guide.title}
                    slug={guide.slug}
                    hero_image={guide.hero_image}
                    lqip={guide.lqip}
                    bg={guide.palette?.vibrant?.background || "inherit"}
                    bgDark={guide.palette?.darkVibrant?.background || "inherit"}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
        </section>
      </div>
      <p className="ml-3 mt-16 w-[calc(100%-0.75rem)] max-w-3xl text-right font-serif text-xs italic leading-5 sm:ml-auto sm:mt-14 sm:w-auto sm:text-sm sm:leading-relaxed md:absolute md:-bottom-16 md:right-6 md:mt-0">
        Well, that is one of the things to find out sometime.
        <br />
        Isn&apos;t it splendid to think of all the things there are to find out about?
        <br />
        It just makes me feel glad to be alive - it&apos;s such an interesting world.
        <br />
        It wouldn&apos;t be half so interesting if we know all about everything, would it?
        <br />
        There&apos;d be no{"\u00a0"}<b>scope for imagination</b>{"\u00a0"}then, would there?
        <br />
        <br />
        <span className="block text-right font-serif text-xs italic leading-relaxed text-stone-500">
          - Anne of Green Gables, L. M. Montgomery
        </span>
      </p>
    </main>
  );
}
