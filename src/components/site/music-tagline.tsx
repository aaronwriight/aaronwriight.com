import type { ReactNode } from "react";
import type { MusicCredit } from "@/lib/music-credit";

export function MusicIcon() {
  return <span aria-hidden="true" className="text-[0.7rem]">♪</span>;
}

export function MusicTagline({
  music,
  className = "",
  icon = <MusicIcon />,
}: {
  music?: MusicCredit | null;
  className?: string;
  /** What stands in front of the credit; the entry page swaps the note for a play button (song-preview.tsx). */
  icon?: ReactNode;
}) {
  if (!music) return null;

  const credit = (
    <>
      <span className="italic">{music.title}</span>, {music.artist}
    </>
  );

  return (
    <p
      className={`flex flex-wrap items-baseline gap-x-1 text-xs leading-6 text-stone-450 ${className}`}
    >
      {icon}
      <span aria-hidden="true" className="text-[0.7rem]">
        •
      </span>
      {music.url ? (
        <a
          href={music.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit transition-colors hover:text-olive"
          aria-label={`${music.title} by ${music.artist} (opens in a new tab)`}
        >
          {credit}
        </a>
      ) : (
        <span>{credit}</span>
      )}
    </p>
  );
}
