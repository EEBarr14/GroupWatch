import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import type { MediaEntry } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";
import { LibraryCard } from "../library-card";

async function StarredContent() {
  await connection();
  const supabase = await createClient();
  const { data: stars } = await supabase
    .from("stars")
    .select("media_entry_id")
    .order("created_at", { ascending: false });
  const starredIds = (stars ?? []).map((star) => star.media_entry_id);

  let entries: MediaEntry[] = [];

  if (starredIds.length > 0) {
    const { data } = await supabase
      .from("media_entries")
      .select(
        "id, title, media_type, watch_status, streaming_service, rating, review, genre_id, created_at, updated_at, genres(name)",
      )
      .in("id", starredIds);
    const entriesById = new Map(
      ((data ?? []) as MediaEntry[]).map((entry) => [entry.id, entry]),
    );
    entries = starredIds
      .map((id) => entriesById.get(id))
      .filter((entry): entry is MediaEntry => Boolean(entry));
  }

  return (
    <>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">
            Starred
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[#fff1d6] sm:text-6xl">
            The ones I want close at hand.
          </h1>
          <p className="mt-4 text-[#fff1d6]/65">
            {entries.length === 0
              ? "Star a title to save it here."
              : `${entries.length} starred ${entries.length === 1 ? "title" : "titles"}`}
          </p>
        </div>
        <Link
          href="/library"
          className="shrink-0 rounded-full border border-[#fff1d6]/35 px-6 py-3.5 text-center font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10"
        >
          View all titles
        </Link>
      </section>

      {entries.length === 0 ? (
        <section className="mt-12 rounded-[2rem] border border-[#fff1d6]/25 bg-[#fff1d6] p-8 text-[#261b2a] shadow-2xl sm:p-12">
          <p className="text-5xl text-[#d65a4a]" aria-hidden="true">☆</p>
          <h2 className="mt-5 text-3xl font-semibold">Nothing starred yet.</h2>
          <p className="mt-3 max-w-xl text-lg leading-8 text-[#6e3b5d]">
            Use the star on any library card or detail page to make a short list of favorites.
          </p>
          <Link
            href="/library"
            className="mt-7 inline-flex rounded-full bg-[#d65a4a] px-6 py-3 font-bold text-white transition hover:bg-[#c94f41]"
          >
            Browse my library
          </Link>
        </section>
      ) : (
        <section aria-label="Starred entries" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <LibraryCard key={entry.id} entry={entry} isStarred />
          ))}
        </section>
      )}
    </>
  );
}

export default function StarredPage() {
  return (
    <Suspense
      fallback={
        <section>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">Starred</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#fff1d6] sm:text-6xl">Gathering your favorites…</h1>
        </section>
      }
    >
      <StarredContent />
    </Suspense>
  );
}
