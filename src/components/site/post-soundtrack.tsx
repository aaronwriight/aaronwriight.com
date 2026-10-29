"use client";

import { useEffect, useRef, useState } from "react";
import { spotifyTrackUri, type MusicCredit } from "@/lib/music-credit";

// "Listen while you read": the post's song in Spotify's own player, which plays a preview clip (Spotify picks it, often
// 15 to 30 seconds) unless the reader is signed in to Spotify. Nothing loads from Spotify until the reader asks. When the song (or preview)
// ends, the player rests and then plays it again. Spotify's player has no volume control, so there are no fades.
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

export function PostSoundtrack({ music }: { music?: MusicCredit | null }) {
  const uri = spotifyTrackUri(music);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !uri || !holder.current) return;
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
          // The reader just asked, so start right away (browsers that want a tap on the player itself will show it).
          embed.addListener("ready", () => embed.play());
          embed.addListener("playback_update", ({ data }) => {
            const { duration, position } = data;
            // At the end the player reports position = duration without ever saying it paused, and a preview's
            // duration is the clip's own length (often 15 to 30 seconds), so position alone tells us it finished.
            if (duration > 0 && position >= duration - END_SLACK_MS) {
              if (ended) return;
              ended = true;
              clearRest();
              restTimer = window.setTimeout(playAgain, REST_MS);
              return;
            }
            // Anything else (playing again, or the reader pausing mid-song) cancels a pending replay; a reader's
            // pause is left alone until they press play.
            ended = false;
            clearRest();
          });
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      clearRest();
      controller?.destroy();
      wrapper.replaceChildren();
    };
  }, [open, uri]);

  if (!uri || failed) return null;

  const buttonClass =
    "cursor-pointer text-xs leading-6 text-olive hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

  return (
    <div className="space-y-2">
      {open ? (
        <>
          {/* Clipped to the player's own 12px rounding: at night the browser paints a light backdrop behind Spotify's
              light-scheme page, which would otherwise show at the corners. */}
          <div
            ref={holder}
            className="max-w-md overflow-hidden rounded-[12px] [&_iframe]:block"
            aria-label={`${music?.title} by ${music?.artist}, in Spotify's player`}
          />
          <p className="flex flex-wrap items-baseline gap-x-2 text-[0.7rem] leading-5 text-stone-450">
            <span>a preview unless you are signed in to Spotify; it plays again after a short rest</span>
            <span aria-hidden="true">•</span>
            <button type="button" className={buttonClass} onClick={() => setOpen(false)}>
              stop the music
            </button>
          </p>
        </>
      ) : (
        <button type="button" className={buttonClass} onClick={() => setOpen(true)}>
          <span aria-hidden="true">♪ </span>listen while you read
        </button>
      )}
    </div>
  );
}
