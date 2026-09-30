"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const albums = [
  { title: "Fighter Dog", artist: "Nikki Falk", href: "https://open.spotify.com/album/57pXQxr9mmsmf6sohGsyp0", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02f448599a110b0928cf32efec" },
  { title: "Never Land II", artist: "Andy Mineo", href: "https://open.spotify.com/album/3YB6qDZLtFID4wyBXvVSbL", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029b053382ae45874afb7fff16" },
  { title: "Liquorice", artist: "Hatchie", href: "https://open.spotify.com/album/0dtHFmAZG3WuxrpxxGoXlV", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ba8cfa0912d3ce0b674c8f5f" },
  { title: "Marginalia (Deluxe)", artist: "ella jane", href: "https://open.spotify.com/album/0gRouCGuPLYRmHcf7dkTWd", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d4d31dc4fb24f8b2498bb19e" },
  { title: "The Definition", artist: "Jon Bellion", href: "https://open.spotify.com/album/7EOvtHDxbltA0GNC4mvLAC", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0212388a3d3a11600641476f89" },
  { title: "Everybody", artist: "Logic", href: "https://open.spotify.com/album/1HiN2YXZcc3EjmVZ4WjfBk", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02cfdf40cf325b609a52457805" },
  { title: "Change of Scenery II", artist: "Quinn XCII", href: "https://open.spotify.com/album/6B3LAqHoBKmSN9HLbyy0Ro", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02d827f56df28bdd1de12fd3c6" },
  { title: "Brol La Suite", artist: "Angèle", href: "https://open.spotify.com/album/2UrPmvaX5X76LIzE6Cfiqu", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02df8a2ed8111de3161c4a4c30" },
  { title: "Rainbow Mixtape", artist: "COIN", href: "https://open.spotify.com/album/42SAgjuUp25kQT9I04ph1w", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02936cc0961f0bbf73ac4c7663" },
  { title: "Songs For The Canyon", artist: "John Vincent III", href: "https://open.spotify.com/album/1k7iymTuRK6I4tvn0SX38I", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0208a66977e9abd024d4644f81" },
  { title: "True Love", artist: "Crystal Gayle", href: "https://open.spotify.com/album/7eqdUZuRuOkurhzRWr6YUn", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e7605def78b613152f526e3f" },
  { title: "From The Valley", artist: "Ilsey", href: "https://open.spotify.com/album/7FghAqLEF3Qvjv91tcwKTc", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029e499ddfba04184839c74179" },
  { title: "Devotion [Deluxe]", artist: "Sunday (1994)", href: "https://open.spotify.com/album/4QszKQEmQxFd6km1COQaoI", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c289027b369d78c5083a8f89" },
  { title: "Vice City Magic", artist: "Mustard Service", href: "https://open.spotify.com/album/4nYVLUVhQb9bD7l1QlYoFS", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0232e541bf2b37baff5dc91f13" },
  { title: "High Highs to Low Lows", artist: "Lolo Zouaï", href: "https://open.spotify.com/album/19MlQDyvGCFXcSaoPLJCAi", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026ac6c80cfb715d6198652472" },
  { title: "Jean", artist: "Yebba", href: "https://open.spotify.com/album/27SQuR7jPiGkJJXl8njEqY", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025932b2362d978f6fa10ca63e" },
  { title: "Cape God [Deluxe]", artist: "Allie X", href: "https://open.spotify.com/album/5czKm6HdhwZ8AXFLpcWxTE", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0235ee1585d91ab7f073b6f6d6" },
  { title: "Essex Honey", artist: "Blood Orange", href: "https://open.spotify.com/album/5RUma3H9uzDLXxwT7JzTel", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020710ea6bfb5a1208a5105693" },
  { title: "Desire, I Want To Turn Into You: Everasking Edition", artist: "Caroline Polachek", href: "https://open.spotify.com/album/25ktFe8igqIwv9aRbkdnTS", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0287858817af31c6329252c8c4" },
  { title: "I Miss You, I Do", artist: "Arny Margret", href: "https://open.spotify.com/album/4f3yGbwInBCKTfop0dLrkC", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c3f36fe0fc58f3de3be4e39b" },
  { title: "Good at Falling", artist: "The Japanese House", href: "https://open.spotify.com/album/4ByOqAhq3BuBo0sN54XkEQ", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a29c01858a37dea4c6eefd83" },
  { title: "brent iii", artist: "Jeremy Zucker & Chelsea Cutler", href: "https://open.spotify.com/album/35tILwApqYtN9fTJq2v7M3", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0280a409b73bd9ea1006881557" },
  { title: "Grand Romantic", artist: "Nate Ruess", href: "https://open.spotify.com/album/0vrIRUpI2gB2QqOUQEG05v", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02549ad91149cdf29a01bf6182" },
  { title: "Honey", artist: "Samia", href: "https://open.spotify.com/album/2eN97mVJc9gsJqmHnHpInv", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023c4add03c996a83696a7129b" },
  { title: "Oh Wonder", artist: "Oh Wonder", href: "https://open.spotify.com/album/37ABUtLPqktcopsBJ7jmXT", artwork: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027cc94e776ebb63dd08c8422c" },
  { title: "Women In Music, Pt. III (Expanded Edition)", artist: "HAIM", href: "https://open.spotify.com/album/79thwyFL6Uo6rgTp3YWEAf", artwork: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02667f8cfd1be0d0cc2b825e25" },
] as const;

export function AlbumCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const positionRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!track || !firstSet) return;

    let animationFrame = 0;
    let previousTime = performance.now();

    const normalizePosition = (position: number) => {
      const loopWidth = firstSet.offsetWidth;
      if (!loopWidth) return position;

      return ((position % loopWidth) + loopWidth) % loopWidth;
    };

    const animate = (currentTime: number) => {
      const elapsed = Math.min(currentTime - previousTime, 50);
      previousTime = currentTime;

      if (!pausedRef.current) {
        // Accumulate fractional pixels separately so WebKit cannot round each
        // individual frame back to zero before the carousel visibly advances.
        positionRef.current = normalizePosition(positionRef.current + elapsed * 0.04);
        track.scrollLeft = positionRef.current;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const browseWithWheel = (event: WheelEvent) => {
      const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const loopWidth = firstSet.offsetWidth;
      if (!movement || !loopWidth) return;

      event.preventDefault();
      positionRef.current = normalizePosition(track.scrollLeft + movement);
      track.scrollLeft = positionRef.current;
    };

    track.addEventListener("wheel", browseWithWheel, { passive: false });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      track.removeEventListener("wheel", browseWithWheel);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section aria-labelledby="favorite-albums-heading" className="group/carousel">
      <div className="flex items-baseline justify-between gap-4">
        <p id="favorite-albums-heading">
          <strong>artists &amp; albums</strong>
        </p>
        <p className="m-0 text-xs text-stone-400 transition-colors group-hover/carousel:text-stone-600 dark:group-hover/carousel:text-stone-300">
          scroll to browse
        </p>
      </div>
      <div
        ref={trackRef}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          positionRef.current = trackRef.current?.scrollLeft ?? positionRef.current;
          pausedRef.current = false;
        }}
        onFocusCapture={() => {
          pausedRef.current = true;
        }}
        onBlurCapture={() => {
          positionRef.current = trackRef.current?.scrollLeft ?? positionRef.current;
          pausedRef.current = false;
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          positionRef.current = trackRef.current?.scrollLeft ?? positionRef.current;
          pausedRef.current = false;
        }}
        className="album-carousel-track -mx-1 mt-2 flex overflow-x-auto px-1 pb-3"
      >
        {[false, true].map((duplicate) => (
          <div
            key={duplicate ? "duplicate" : "original"}
            ref={duplicate ? undefined : firstSetRef}
            aria-hidden={duplicate || undefined}
            className="flex shrink-0 gap-3 pr-3"
          >
            {albums.map((album) => (
              <Link
                key={album.href}
                href={album.href}
                aria-label={duplicate ? undefined : `${album.title} by ${album.artist} on Spotify`}
                tabIndex={duplicate ? -1 : undefined}
                className="group w-28 shrink-0 no-underline hover:no-underline sm:w-32"
              >
                <Image
                  src={album.artwork}
                  alt={duplicate ? "" : `${album.title} album cover`}
                  width={256}
                  height={256}
                  sizes="(min-width: 640px) 128px, 112px"
                  className="m-0 aspect-square w-full rounded-sm border border-stone-200 object-cover transition-opacity group-hover:opacity-80 dark:border-stone-700"
                />
                <span className="mt-2 block text-xs leading-4 text-stone-900 group-hover:text-[#6f8200] dark:text-stone-100">
                  <em>{album.title}</em>
                </span>
                <span className="mt-0.5 block text-[0.7rem] leading-4 text-stone-500">{album.artist}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
