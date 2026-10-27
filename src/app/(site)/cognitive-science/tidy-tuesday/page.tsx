import { permanentRedirect } from "next/navigation";

export default function LegacyTidyTuesdayPage() {
  permanentRedirect("/cognitive-science/projects/tidy-tuesday");
}
