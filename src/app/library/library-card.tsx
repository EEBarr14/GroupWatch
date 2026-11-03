import Link from "next/link";
import { TvRatingDisplay } from "@/components/tv-rating";
import type { MediaEntry } from "@/lib/library";
import { genreName, statusClasses } from "@/lib/library";
import { updateStar } from "./actions";
import { StarToggleForm } from "./star-toggle-form";

export function LibraryCard({
  entry,
  isStarred,
}: {
  entry: MediaEntry;
  isStarred: boolean;
}) {
  const starAction = updateStar.bind(null, entry.id);

  return (
    <article className="group flex min-h-64 flex-col rounded-[1.75rem] border border-[#fff1d6]/20 bg-[#fff1d6] p-6 text-[#261b2a] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#6e3b5d]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
            {entry.media_type}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses(entry.watch_status)}`}
          >
            {entry.watch_status}
          </span>
        </div>
        <StarToggleForm
          action={starAction}
          initiallyStarred={isStarred}
          title={entry.title}
        />
      </div>
      <Link
        href={`/library/${entry.id}`}
        className="flex flex-1 flex-col rounded-xl focus-visible:outline-offset-4"
      >
        <div className="my-auto py-8">
          <h2 className="text-2xl font-semibold leading-tight transition group-hover:text-[#d65a4a]">
            {entry.title}
          </h2>
          <p className="mt-3 text-sm font-semibold text-[#6e3b5d]">
            {genreName(entry)}
          </p>
          {entry.streaming_service && (
            <p className="mt-2 text-sm text-[#6e3b5d]/75">
              Watching on {entry.streaming_service}
            </p>
          )}
          {entry.rating && (
            <div className="mt-4 text-[#d65a4a]">
              <TvRatingDisplay rating={entry.rating} compact />
            </div>
          )}
        </div>
        <p className="text-sm font-bold text-[#d65a4a]">
          Open details <span aria-hidden="true">→</span>
        </p>
      </Link>
    </article>
  );
}
