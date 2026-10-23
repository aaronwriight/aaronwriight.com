import { permanentRedirect } from "next/navigation";

export default function LegacyInspirationsPage() {
  permanentRedirect("/creative/inspirations");
}
