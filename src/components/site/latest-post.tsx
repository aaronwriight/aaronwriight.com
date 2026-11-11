import { SfiPostHeader, type SfiPostHeaderData } from "@/components/site/sfi-post-header";

// The newest entry on a journal's about page: its header (the title links to the entry) on the left and its opening
// line on the right, set out like the rows of the journal index (stacked on narrow screens).
export function LatestPost({ post, href }: { post: SfiPostHeaderData & { excerpt?: string }; href: string }) {
  return (
    <section aria-labelledby="latest-post" className="not-prose">
      <h2 id="latest-post" className="mb-4 font-serif text-xs font-normal lowercase tracking-widest text-stone-500">the latest</h2>
      <article className="grid gap-x-10 gap-y-4 border-y border-stone-300 py-6 dark:border-stone-700 md:grid-cols-[minmax(0,1.1fr)_minmax(13rem,0.9fr)] md:items-end">
        <SfiPostHeader post={post} href={href} />
        {post.excerpt ? (
          <p className="m-0 max-w-sm font-serif text-sm italic leading-6 text-stone-500 md:justify-self-end">{post.excerpt}</p>
        ) : null}
      </article>
    </section>
  );
}
