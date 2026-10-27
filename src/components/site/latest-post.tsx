import Link from "next/link";
import { SfiPostHeader, type SfiPostHeaderData } from "@/components/site/sfi-post-header";

// The newest entry on a journal's about page: its header, its opening line, and the way in.
export function LatestPost({ post, href }: { post: SfiPostHeaderData & { excerpt?: string }; href: string }) {
  return (
    <section aria-labelledby="latest-post" className="not-prose">
      <h2 id="latest-post" className="mb-4 font-serif text-xs font-normal lowercase tracking-widest text-stone-500">the latest</h2>
      <article className="border-y border-stone-300 py-6 dark:border-stone-700">
        <SfiPostHeader post={post} href={href} />
        {post.excerpt ? <p className="mb-0 mt-4 max-w-xl font-serif text-sm italic leading-6 text-stone-500">{post.excerpt}</p> : null}
        <Link href={href} className="mt-4 inline-block text-xs text-olive">
          read the entry <span aria-hidden="true">→</span>
        </Link>
      </article>
    </section>
  );
}
