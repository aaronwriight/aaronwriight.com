import type { Metadata } from "next";
import Link from "next/link";
import { CreativeShell } from "@/components/site/site-content";
import { MusicIcon } from "@/components/site/music-tagline";
import { PersonalAnchorRedirect } from "@/components/site/personal-anchor-redirect";

export const metadata: Metadata = {
  title: "about | creative",
  description: "Aaron Wright: cognitive scientist, photographer, artist. Stories, creative work, and a few favorite things.",
  alternates: { canonical: "/creative" },
};

export default function CreativeAboutPage() {
  return (
    <CreativeShell>
      <PersonalAnchorRedirect />
      <p>Hi! :)</p>

      <p>
        I&apos;m Aaron! I work in research full time, but I&apos;m equally driven to create! I have probably <em>too</em> many &quot;in-progress&quot; projects... I run a photography business (which you can check out <Link href="/frame-it-wright-photography" aria-label="About Frame It Wright Photography">here</Link>), &quot;publish&quot; written pieces on travel, science, art, and my random endeavors (<Link href="/scope-for-imagination" aria-label="Read Scope for Imagination">here</Link>), and love all things outdoors, music, and social life.
      </p>

      <p>Whether you&apos;re finding me from within a scientific community or the arts, here&apos;s some fun things about me to help spark a conversation!</p>

      <p>I&apos;m fascinated with learning languages and exploring cultures –– I&apos;ve spent some time teaching English overseas (Cambodia) and periodically lead international volunteer service-learning trips (Iceland).</p>

      <p>
        I&apos;ve grown up and lived in New England and now hang around Boston, which has landed me firmly in both the great outdoors and the academic world. I often tell folks, &quot;If I&apos;m not sciencing, I&apos;m hiking.&quot; I lead backpacking trips whenever possible, and <em>frequently</em> dream about my next wilderness excursion. For all intents and purposes, I fall in the &quot;granola&quot; camp, although I&apos;m not nearly the coffee occifiando needed to complete the persona... yet.
      </p>

      <p>I believe deeply in living a slow life -- taking time to be present with and for the people I come to meet and know and love; asking thoughtful questions and seeking out stories with the intention of knowing people purely for the sake of knowing them. Everyone has a story, and mine has been quite enriched by those of others around me. I&apos;ve rarely regretted taking a little extra time to hear what someone has to say, and I like to encourage others to go about their lives the same way.</p>

      <p>
        I draw inspiration from a wide variety of sources, from heartfelt cartoon classics like <em>Peanuts</em> and <em>Calvin &amp; Hobbes</em> to popular gaming franchises like Pokémon and Zelda, to thought-provoking art and literature, and of course the great outdoors. I love simple joys found in the natural world and celebrated in community –– like caramel stroopwafels and inconvenient excursions for good views. I love the feeling of sharing interests with circumstantial strangers, which, I suppose, is why this page matters to me!
      </p>

      <p>You can find a few of my favorite things (perpetually to recently-ish) listed below, in case you want some specifics. I also share some of my <Link href="/creative/inspirations">inspirations</Link> in full for those with a little more time on their hands.</p>

      <p>In either case, I hope to leave you with a little more scope for imagination in your life –– stick aroudn to see where I&apos;ve found it in my own. :)</p>

      {/* Favourite things, set like bullets: the icons in one column, centred on one another, the colons in the next,
          each centred on the first line of its entry. */}
      <dl className="not-prose m-0 grid grid-cols-[1rem_auto_minmax(0,1fr)] gap-x-2 gap-y-3 border-t border-stone-200 pt-5 text-sm leading-6 dark:border-stone-800">
        <dt className="flex h-6 items-center justify-center text-stone-500"><MusicIcon /><span className="sr-only">Music</span></dt>
        <dd className="m-0 flex h-6 items-center text-stone-500" aria-hidden="true">:</dd>
        <dd className="m-0"><Link href="https://www.youtube.com/watch?v=TiD_dSExqVU" className="text-olive">COIN - Sagittarius Superstar (feat. Faye Webster) (Official Video)</Link></dd>
        <dt className="flex h-6 items-center justify-center text-stone-500">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M12 5.5C9 3.5 5.5 3.5 2 4.5v15c3.5-1 7-1 10 1 3-2 6.5-2 10-1v-15c-3.5-1-7-1-10 1Zm0 0v15" />
          </svg>
          <span className="sr-only">Books</span>
        </dt>
        <dd className="m-0 flex h-6 items-center text-stone-500" aria-hidden="true">:</dd>
        <dd className="m-0"><Link href="https://www.kristinohlson.com/books/sweet-in-tooth-and-claw" className="text-olive">Sweet in Tooth and Claw: Stories of Generosity and Cooperation in the Natural World</Link></dd>
        {/* Two additional favorite-things entries are unfinished in the author's draft and intentionally not rendered. */}
      </dl>

      {/* Where "scope for imagination" comes from. It closed the old home page (the stories & guides list) until
          November 2026. */}
      <figure className="not-prose ml-auto mt-14 max-w-xl text-right">
        <blockquote className="m-0 font-serif text-sm italic leading-relaxed">
          Well, that is one of the things to find out sometime.
          <br />
          Isn&apos;t it splendid to think of all the things there are to find out about?
          <br />
          It just makes me feel glad to be alive - it&apos;s such an interesting world.
          <br />
          It wouldn&apos;t be half so interesting if we know all about everything, would it?
          <br />
          There&apos;d be no{"\u00a0"}<b>scope for imagination</b>{"\u00a0"}then, would there?
        </blockquote>
        <figcaption className="mt-3 font-serif text-xs italic leading-relaxed text-stone-500">- Anne of Green Gables, L. M. Montgomery</figcaption>
      </figure>
    </CreativeShell>
  );
}
