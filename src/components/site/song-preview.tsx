"use client";

import { useEffect, useRef, useState } from "react";
import { MusicTagline } from "@/components/site/music-tagline";
import { spotifyTrackUri, type MusicCredit } from "@/lib/music-credit";

// The song credit on an entry's own page, with its note as a quiet play button. Tapping the note opens Spotify's
// compact player under the credit and plays the song: a preview clip (Spotify picks it, often 15 to 30 seconds) unless
// the reader is signed in to Spotify. When it ends, it rests and plays again; tapping the note stops it and the player
// goes away. Nothing loads from Spotify until then.
//
// Spotify's terms require its player to be shown, unaltered, while it plays, and it has no volume control, so the song
// cannot fade or play out of sight; browsers also block sound until the reader taps. Hence a tap, not autoplay.
// API: https://developer.spotify.com/documentation/embeds/references/iframe-api

type PlaybackState = { isPaused: boolean; isBuffering: boolean; duration: number; position: number };
type EmbedController = {
  addListener(event: "ready", handler: () => void): void;
  addListener(event: "playback_update", handler: (event: { data: PlaybackState }) => void): void;
  play(): void;
  restart(): void;
  destroy(): void;
};
type IframeApi = {
  createController(
    element: HTMLElement,
    options: { uri: string; width?: string; height?: number; theme?: "dark" },
    callback: (controller: EmbedController) => void,
  ): void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IframeApi) => void;
  }
}

const API_URL = "https://open.spotify.com/embed/iframe-api/v1";
const REST_MS = 15_000; // the quiet between plays
const END_SLACK_MS = 800; // this close to the end counts as finished

let apiPromise: Promise<IframeApi> | null = null;

function loadSpotifyApi(): Promise<IframeApi> {
  apiPromise ??= new Promise<IframeApi>((resolve, reject) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);
    const script = document.createElement("script");
    script.src = API_URL;
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Spotify could not be reached"));
    };
    document.body.appendChild(script);
  });
  return apiPromise;
}

export function PlayableMusicTagline({ music, className = "" }: { music?: MusicCredit | null; className?: string }) {
  const uri = spotifyTrackUri(music);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || !uri || !holder.current) return;
    const wrapper = holder.current;
    let controller: EmbedController | null = null;
    let restTimer: number | undefined;
    let cancelled = false;
    let ended = false;

    const clearRest = () => {
      window.clearTimeout(restTimer);
      restTimer = undefined;
      document.removeEventListener("visibilitychange", onVisible);
    };
    // Play again once the rest is over, but only while someone can hear it: a hidden tab waits until it is seen again.
    const playAgain = () => {
      if (document.hidden) {
        document.addEventListener("visibilitychange", onVisible);
        return;
      }
      ended = false;
      controller?.restart();
    };
    function onVisible() {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", onVisible);
      playAgain();
    }

    loadSpotifyApi()
      .then((api) => {
        if (cancelled) return;
        // Spotify replaces the element it is given with its iframe, so it gets its own child, not a React node.
        const target = document.createElement("div");
        wrapper.appendChild(target);
        const night = document.documentElement.classList.contains("dark");
        api.createController(target, { uri, width: "100%", height: 80, ...(night ? { theme: "dark" as const } : {}) }, (embed) => {
          if (cancelled) {
            embed.destroy();
            return;
          }
          controller = embed;
          // The reader just tapped, so start right away (browsers that want a tap on the player itself will show it).
          embed.addListener("ready", () => embed.play());
          embed.addListener("playback_update", ({ data }) => {
            const { duration, position } = data;
            // At the end the player reports position = duration without saying it paused, and a preview's duration is
            // the clip's own length, so position alone tells us it finished.
            if (duration > 0 && position >= duration - END_SLACK_MS) {
              if (ended) return;
              ended = true;
              clearRest();
              restTimer = window.setTimeout(playAgain, REST_MS);
              return;
            }
            // Playing again, or the reader pausing mid-song: cancel a pending replay and leave a pause alone.
            ended = false;
            clearRest();
          });
        });
      })
      .catch(() => {
        if (cancelled) return;
        setPlaying(false);
        setUnavailable(true);
      });

    return () => {
      cancelled = true;
      clearRest();
      controller?.destroy();
      wrapper.replaceChildren();
    };
  }, [playing, uri]);

  if (!uri || unavailable) return <MusicTagline music={music} className={className} />;

  const note = (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={playing ? `Stop ${music?.title}` : `Play a preview of ${music?.title}`}
      title={playing ? "stop" : "play a preview"}
      onClick={() => setPlaying((value) => !value)}
      className={`-m-1 cursor-pointer p-1 text-[0.7rem] leading-none transition-colors hover:text-olive focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-signal ${
        playing ? "text-olive motion-safe:animate-pulse" : "text-inherit"
      }`}
    >
      ♪
    </button>
  );

  return (
    <div className={className}>
      <MusicTagline music={music} icon={note} />
      {playing && (
        // Clipped to the player's own 12px rounding: at night the browser paints a light backdrop behind Spotify's
        // light-scheme page, which would otherwise show at the corners.
        <div ref={holder} className="mt-1 max-w-xs overflow-hidden rounded-[12px] [&_iframe]:block" />
      )}
    </div>
  );
}
