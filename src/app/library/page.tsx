import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import type { MediaEntry } from "@/lib/library";
import { genreName, statusClasses } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";
import { WatchPartyLineArt } from "@/components/line-art";
import { TvRatingDisplay } from "@/components/tv-rating";

async function LibraryContent() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_entries")
    .select(
      "id, title, media_type, watch_status, streaming_service, rating, review, genre_id, created_at, updated_at, genres(name)",
    )
    .order("created_at", { ascending: false });
  const entries = (data ?? []) as MediaEntry[];

  return (
    <>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">
            My library
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[#fff1d6] sm:text-6xl">
            Everything I&apos;m watching, all in one place.
          </h1>
          <p className="mt-4 text-[#fff1d6]/65">
            {entries.length === 0
              ? "Your library is ready for its first title."
              : `${entries.length} ${entries.length === 1 ? "title" : "titles"} in your library`}
          </p>
        </div>
        <Link
          href="/library/new"
          className="shrink-0 rounded-full bg-[#f29e4c] px-6 py-3.5 text-center font-black text-[#261b2a] shadow-lg shadow-black/15 transition hover:bg-[#f6c85f]"
        >
          + Add a title
        </Link>
      </section>

      {entries.length === 0 ? (
        <section className="mt-12 overflow-hidden rounded-[2rem] border border-[#fff1d6]/25 bg-[#fff1d6] text-[#261b2a] shadow-2xl">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-12">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d65a4a]">
                A blank page, in a good way
              </p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Add the next thing you want to watch.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-[#6e3b5d]">
                Start with a movie you keep meaning to see or the show you are
                already halfway through.
              </p>
              <Link
                href="/library/new"
                className="mt-8 inline-flex rounded-full bg-[#d65a4a] px-6 py-3 font-bold text-white transition hover:bg-[#c94f41]"
              >
                Add my first title
              </Link>
            </div>
            <div className="relative flex min-h-64 items-center overflow-hidden bg-[linear-gradient(145deg,#6e3b5d_0%,#d65a4a_55%,#f29e4c_100%)] px-5">
              <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#f6c85f]/45 blur-2xl" />
              <WatchPartyLineArt
                className="relative w-full text-[#fff1d6]"
                accent="#f6c85f"
              />
            </div>
          </div>
        </section>
      ) : (
        <section
          aria-label="Library entries"
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/library/${entry.id}`}
              className="group flex min-h-64 flex-col rounded-[1.75rem] border border-[#fff1d6]/20 bg-[#fff1d6] p-6 text-[#261b2a] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-[#6e3b5d]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
                  {entry.media_type}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses(entry.watch_status)}`}
                >
                  {entry.watch_status}
                </span>
              </div>
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
          ))}
        </section>
      )}
    </>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <section>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">
            My library
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#fff1d6] sm:text-6xl">
            Opening your watchlist…
          </h1>
          <div className="mt-12 h-64 animate-pulse rounded-[2rem] bg-[#fff1d6]/15" />
        </section>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}
