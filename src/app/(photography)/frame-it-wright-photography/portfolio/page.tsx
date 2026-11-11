import type { Metadata } from "next";
import { CreateWithMe } from "@/components/photography/create-with-me";
import { PortfolioBackdrop } from "@/components/photography/portfolio-backdrop";
import { photographySessions, photoPath } from "@/data/photography";
import { isWide, sessionPhotos } from "@/lib/photography";

export const metadata: Metadata = {
  title: "portfolio",
  description: "Weddings, couples & engagement, family, friends, & lifestyle, graduation & seniors, and portraits.",
  alternates: { canonical: "/portfolio" },
};

export default function PhotographyPortfolioPage() {
  const sessions = photographySessions.map((session) => {
    // The backdrop is the session's first landscape photograph (favourites come first), or its first of any shape.
    const photos = sessionPhotos(session.slug);
    const cover = photos.find(isWide) ?? photos[0];
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
