export type MusicCredit = Readonly<{
  title: string;
  album?: string;
  artist: string;
  url?: string;
}>;

function isHttpUrl(value: string): boolean {
  if (value !== value.trim() || /\s/.test(value)) return false;

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

/**
 * The Spotify track URI ("spotify:track:<id>") when the credit links to a Spotify track, else null. A Spotify link is
 * what turns on the post's "listen while you read" player.
 */
export function spotifyTrackUri(music: MusicCredit | null | undefined): string | null {
  const match = music?.url?.match(/^https:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{22})(?:[/?#]|$)/);
  return match ? `spotify:track:${match[1]}` : null;
}

export function isMusicCredit(value: unknown): value is MusicCredit {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const music = value as Record<string, unknown>;
  const allowedKeys = new Set(["title", "album", "artist", "url"]);
  return (
    Object.keys(music).every((key) => allowedKeys.has(key)) &&
    typeof music.title === "string" &&
    music.title.trim().length > 0 &&
    (music.album === undefined || (typeof music.album === "string" && music.album.trim().length > 0)) &&
    typeof music.artist === "string" &&
    music.artist.trim().length > 0 &&
    (music.url === undefined || (typeof music.url === "string" && isHttpUrl(music.url)))
  );
}
