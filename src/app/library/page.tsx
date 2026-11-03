import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import type { Genre, MediaEntry } from "@/lib/library";
import { mediaTypes, watchStatuses } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";
import { WatchPartyLineArt } from "@/components/line-art";
import { LibraryCard } from "./library-card";
import {
  LibraryFilters,
  type LibraryFilterValues,
  type LibrarySort,
} from "./library-filters";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function LibraryContent({
  searchParams,
}: {
  searchParams: PageProps<"/library">["searchParams"];
}) {
  const params = await searchParams;
  await connection();
  const supabase = await createClient();
  const [{ data: genreData }, { data: stars }] = await Promise.all([
    supabase.from("genres").select("id, name").order("name"),
    supabase.from("stars").select("media_entry_id"),
  ]);
  const genres = (genreData ?? []) as Genre[];
  const query = firstValue(params.q).trim().slice(0, 100);
  const mediaTypeValue = firstValue(params.type);
  const mediaType = mediaTypes.includes(
    mediaTypeValue as (typeof mediaTypes)[number],
  )
    ? (mediaTypeValue as (typeof mediaTypes)[number])
    : "";
  const watchStatusValue = firstValue(params.status);
  const watchStatus = watchStatuses.includes(
    watchStatusValue as (typeof watchStatuses)[number],
  )
    ? (watchStatusValue as (typeof watchStatuses)[number])
    : "";
  const genreValue = firstValue(params.genre);
  const genreId = genres.some((genre) => String(genre.id) === genreValue)
    ? genreValue
    : "";
  const sortValue = firstValue(params.sort);
  const sort: LibrarySort = ["newest", "title", "rating"].includes(sortValue)
    ? (sortValue as LibrarySort)
    : "newest";
  const filterValues: LibraryFilterValues = {
    query,
    mediaType,
    genreId,
    watchStatus,
    sort,
  };
  const hasFilters = Boolean(
    query || mediaType || genreId || watchStatus || sort !== "newest",
  );

  let entriesQuery = supabase.from("media_entries").select(
    "id, title, media_type, watch_status, streaming_service, rating, review, genre_id, created_at, updated_at, genres(name)",
  );

  if (query) {
    const escapedQuery = query.replace(/[\\%_]/g, "\\$&");
    entriesQuery = entriesQuery.ilike("title", `%${escapedQuery}%`);
  }

  if (mediaType) {
    entriesQuery = entriesQuery.eq("media_type", mediaType);
  }

  if (genreId) {
    entriesQuery = entriesQuery.eq("genre_id", Number(genreId));
  }

  if (watchStatus) {
    entriesQuery = entriesQuery.eq("watch_status", watchStatus);
  }

  if (sort === "title") {
    entriesQuery = entriesQuery.order("title", { ascending: true });
  } else if (sort === "rating") {
    entriesQuery = entriesQuery
      .order("rating", { ascending: false, nullsFirst: false })
      .order("title", { ascending: true });
  } else {
    entriesQuery = entriesQuery.order("created_at", { ascending: false });
  }

  const { data } = await entriesQuery;
  const entries = (data ?? []) as MediaEntry[];
  const starredIds = new Set((stars ?? []).map((star) => star.media_entry_id));
  const resultSummary =
    entries.length === 0 && !hasFilters
      ? "Your library is ready for its first title."
      : entries.length === 0
        ? "No titles match these filters."
        : `${entries.length} ${entries.length === 1 ? "title" : "titles"} in your library`;

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
          <p className="mt-4 text-[#fff1d6]/65">{resultSummary}</p>
        </div>
        <Link
          href="/library/new"
          className="shrink-0 rounded-full bg-[#f29e4c] px-6 py-3.5 text-center font-black text-[#261b2a] shadow-lg shadow-black/15 transition hover:bg-[#f6c85f]"
        >
          + Add a title
        </Link>
      </section>

      <LibraryFilters
        genres={genres}
        values={filterValues}
        hasFilters={hasFilters}
      />

      {entries.length === 0 && !hasFilters ? (
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
      ) : entries.length === 0 ? (
        <section className="mt-8 rounded-[2rem] border border-[#fff1d6]/25 bg-[#fff1d6] p-8 text-[#261b2a] shadow-xl sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#d65a4a]">
            No matches
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Try a broader search.
          </h2>
          <p className="mt-3 max-w-xl text-[#6e3b5d]">
            Change one of the filters or clear them to see everything in your
            library again.
          </p>
          <Link
            href="/library"
            className="mt-6 inline-flex rounded-full bg-[#d65a4a] px-6 py-3 font-bold text-white transition hover:bg-[#c94f41]"
          >
            Clear all filters
          </Link>
        </section>
      ) : (
        <section
          aria-label="Library entries"
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {entries.map((entry) => (
            <LibraryCard
              key={entry.id}
              entry={entry}
              isStarred={starredIds.has(entry.id)}
            />
          ))}
        </section>
      )}
    </>
  );
}

export default function LibraryPage(props: PageProps<"/library">) {
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
      <LibraryContent searchParams={props.searchParams} />
    </Suspense>
  );
}
