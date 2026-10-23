"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// URL fragments never reach the server. Keep existing bookmarks to the old
// inspirations sections useful after /personal redirects to Creative.
export function PersonalAnchorRedirect() {
  const router = useRouter();
  useEffect(() => {
    const redirectAnchor = () => {
      const hash = window.location.hash;
      if (["#art", "#communities", "#inspirations"].includes(hash)) {
        router.replace(`/creative/inspirations${hash}`);
      }
    };
    redirectAnchor();
    window.addEventListener("hashchange", redirectAnchor);
    return () => window.removeEventListener("hashchange", redirectAnchor);
  }, [router]);
  return null;
}
