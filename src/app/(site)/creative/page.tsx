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

      <div className="not-prose space-y-3 border-t border-stone-200 pt-5 text-sm leading-6 dark:border-stone-800">
        <p className="flex items-baseline gap-2">
          <span className="shrink-0 text-stone-500"><MusicIcon /><span className="sr-only">Music</span> :</span>
          <Link href="https://www.youtube.com/watch?v=TiD_dSExqVU" className="text-olive">COIN - Sagittarius Superstar (feat. Faye Webster) (Official Video)</Link>
        </p>
        <p className="flex items-baseline gap-2">
          <span className="inline-flex shrink-0 items-baseline text-stone-500">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative top-0.5 mr-1 h-3.5 w-3.5">
              <path d="M12 5.5C9 3.5 5.5 3.5 2 4.5v15c3.5-1 7-1 10 1 3-2 6.5-2 10-1v-15c-3.5-1-7-1-10 1Zm0 0v15" />
            </svg>
            <span className="sr-only">Books</span> :
          </span>
          <span><Link href="https://www.kristinohlson.com/books/sweet-in-tooth-and-claw" className="text-olive">Sweet in Tooth and Claw: Stories of Generosity and Cooperation in the Natural World</Link>; Anne of Green Gables</span>
        </p>
        {/* Two additional favorite-things entries are unfinished in the author's draft and intentionally not rendered. */}
      </div>
    </CreativeShell>
  );
}
