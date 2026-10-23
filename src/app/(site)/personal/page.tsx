import { permanentRedirect } from "next/navigation";

export default function PersonalPage() {
  // Browsers retain the old fragment. Creative forwards inspiration anchors.
  permanentRedirect("/creative");
}
