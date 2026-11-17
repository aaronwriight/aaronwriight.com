import type { Metadata } from "next";
import { CreateWithMe } from "@/components/photography/create-with-me";
import { PortfolioBackdrop } from "@/components/photography/portfolio-backdrop";
import { photographySessions, photoPath } from "@/data/photography";
import { isWide, sessionCover, sessionPhotos } from "@/lib/photography";

export const metadata: Metadata = {
  title: "portfolio",
  description: "Weddings, couples & engagement, family, friends, & lifestyle, graduation & seniors, and portraits.",
  alternates: { canonical: "/portfolio" },
};

export default function PhotographyPortfolioPage() {
  const sessions = photographySessions.map((session) => {
    // The backdrop is the session's first landscape photograph (favourites come first), or its first of any shape, or
    // (for a session with none yet) the stand-in chosen in home.json.
    const photos = sessionPhotos(session.slug);
    const cover = photos.find(isWide) ?? photos[0] ?? sessionCover(session.slug);
    return {
      slug: session.slug,
      title: session.title,
      href: photoPath(`/portfolio/${session.slug}`),
      count: photos.length,
      cover: cover && { src: cover.src, alt: cover.alt },
    };
  });
  return (
    <>
      <PortfolioBackdrop sessions={sessions} />
      <CreateWithMe />
    </>
  );
}
