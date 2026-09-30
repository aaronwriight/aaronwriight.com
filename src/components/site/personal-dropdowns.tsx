"use client";

import Link from "next/link";
import { DisclosureSection } from "@/components/site/disclosure-section";
import { AlbumCarousel } from "@/components/site/album-carousel";

export function PersonalDropdowns() {
  return (
    <div className="personal-sections divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
      <DisclosureSection id="art" title="Art & media">
        <div className="mt-5 space-y-5">
          <AlbumCarousel />

          <div>
            <p><strong>film</strong></p>
            <ul>
              <li><i>La La Land</i></li>
              <li><i>A Quiet Place</i></li>
              <li><i>Good Will Hunting</i></li>
              <li><i>Spirited Away</i></li>
            </ul>
          </div>

          <div>
            <p><strong>literature</strong></p>
            <ul>
              <li><em>Anne of Green Gables</em>, Lucy Maud Montgomery</li>
              <li><em>The Haunting of Hill House</em>, Shirley Jackson</li>
              <li><em>A Girl of the Limberlost</em>, Gene Stratton-Porter</li>
              <li><em>I&apos;m Glad My Mom Died</em>, <Link href="https://www.jennettemccurdy.com/">Jennette McCurdy</Link></li>
              <li><Link href="https://www.kristinohlson.com/books/sweet-in-tooth-and-claw"><em>Sweet in Tooth and Claw</em></Link>, Kristin Ohlson</li>
            </ul>
          </div>

          <div>
            <p><strong>podcasts</strong></p>
            <ul>
              <li>Pocket-sized science with hand-picked experts: <Link href="https://www.alieward.com">Ologies with Alie Ward</Link></li>
            </ul>
          </div>
        </div>
      </DisclosureSection>

      <DisclosureSection id="communities" title="Communities">
        <ul className="mt-5">
          <li>My home away from science: <Link href="https://lavidacenter.org">La Vida At Gordon College</Link></li>
          <li>Nurturing inclusivity, presence, and creativity: <Link href="https://compasspath.org">Compass</Link></li>
        </ul>
      </DisclosureSection>

      <DisclosureSection id="inspirations" title="Creative initiatives & inspirations">
        <div className="mt-5 space-y-5">
          <div>
            <p><strong>traditional &amp; digital media</strong></p>
            <ul>
              <li>
                <Link href="https://www.etsy.com/shop/PhebeSunriseStudio">Phebe Sunrise Studio</Link>, a Maine-inspired print shop by Kennebunk,
                ME-based artist (and long-time friend), <Link href="https://www.instagram.com/phebegrant.art/">Phebe Grant</Link>
              </li>
              <li>Mesmerizing paintings and sketches done by my friend, <Link href="https://www.instagram.com/jameswellborn.art/">James Wellborn</Link></li>
              <li>A carousel of creative services, inspiration, and encouragement by my friend, <Link href="https://www.melissazaldivar.com/">Melissa Zaldivar Sawyer</Link></li>
            </ul>
          </div>

          <div>
            <p><strong>photography &amp; visual storytelling</strong></p>
            <ul>
              <li>My talented friend and storyteller, Eden Harfield, at <Link href="https://www.edengracecreative.com">Eden Grace Creative</Link></li>
              <li><Link href="https://www.instagram.com/newnativephotography/">New Native Photography</Link>: elopement and weddings, captured by my friend, Lindsey Tillman</li>
              <li>Stunning landscape photography by <Link href="https://www.frihead.ch/">Mathilde Rietsch</Link></li>
              <li>
                Grammy-nominated recording engineer, producer, and audio engineer (and photographer behind many of my sources of inspiration),{" "}
                <Link href="https://www.instagram.com/bellaicecream/?hl=en">Bella Blasko</Link>
              </li>
            </ul>
          </div>

          <div>
            <p><strong>data visualization</strong></p>
            <ul>
              <li>Data visualization and information design by <Link href="https://www.cedricscherer.com">Cédric Scherer</Link></li>
              <li>Transforming data into understanding: <Link href="https://nrennie.rbind.io">Nicola Rennie</Link></li>
            </ul>
          </div>

          <div>
            <p><strong>independent projects &amp; design</strong></p>
            <ul>
              <li>The independent design studio, <Link href="https://houseofdakh.com/">HOUSEOFDAKH</Link></li>
              <li>Jon Bellion&apos;s <Link href="https://www.beautifulmindprojects.com/">Beautiful Mind Projects</Link></li>
              <li>Classical composer, <Link href="https://www.christopherdenniscoleman.com/">Christopher Dennis Coleman</Link></li>
            </ul>
          </div>
        </div>
      </DisclosureSection>
    </div>
  );
}
