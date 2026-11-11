import Link from "next/link";
import { photoPath } from "@/data/photography";

// The close of every photography page: the invitation to book, and the way to delivered photographs.
export function CreateWithMe({ session, clientLine = true }: { session?: string; clientLine?: boolean }) {
  return (
    <section aria-label="Create with me" className="fiw-wrap grid justify-items-center gap-4 py-16 text-center">
      <Link href={photoPath(`/contact${session ? `?session=${session}` : ""}`)} className="fiw-cta">
        Create with me!
      </Link>
      {clientLine && (
        <p className="m-0 text-sm text-stone-500">
          Had a session already? <Link href={photoPath("/galleries")} className="fiw-link text-stone-700 dark:text-stone-300">find your photos</Link>
        </p>
      )}
    </section>
  );
}
