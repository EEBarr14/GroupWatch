import Link from "next/link";
import type { Genre, MediaType, WatchStatus } from "@/lib/library";
import { mediaTypes, watchStatuses } from "@/lib/library";

export type LibrarySort = "newest" | "title" | "rating";

export type LibraryFilterValues = {
  query: string;
  mediaType: MediaType | "";
  genreId: string;
  watchStatus: WatchStatus | "";
  sort: LibrarySort;
};

export function LibraryFilters({
  genres,
  values,
  hasFilters,
}: {
  genres: Genre[];
  values: LibraryFilterValues;
  hasFilters: boolean;
}) {
  const fieldClasses =
    "mt-2 w-full rounded-2xl border border-[#6e3b5d]/20 bg-white px-4 py-3 text-sm font-semibold text-[#261b2a] shadow-sm transition focus:border-[#d65a4a]";

  return (
    <section
      aria-labelledby="find-library-heading"
      className="mt-10 rounded-[2rem] border border-[#fff1d6]/20 bg-[#fff1d6] p-5 text-[#261b2a] shadow-xl sm:p-7"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
            Find something
          </p>
          <h2 id="find-library-heading" className="mt-2 text-2xl font-semibold">
            Search and narrow your library
          </h2>
        </div>
        {hasFilters && (
          <Link
            href="/library"
            className="text-sm font-bold text-[#d65a4a] hover:underline"
          >
            Clear filters
          </Link>
        )}
      </div>

      <form
        method="get"
        action="/library"
        className="mt-6 grid gap-4 lg:grid-cols-5"
      >
        <label className="lg:col-span-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
            Title
          </span>
          <input
            type="search"
            name="q"
            defaultValue={values.query}
            maxLength={100}
            placeholder="Search by title"
            className={fieldClasses}
          />
        </label>

        <label>
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
            Type
          </span>
          <select
            name="type"
            defaultValue={values.mediaType}
            className={fieldClasses}
          >
            <option value="">All types</option>
            {mediaTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
            Genre
          </span>
          <select
            name="genre"
            defaultValue={values.genreId}
            className={fieldClasses}
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
            Status
          </span>
          <select
            name="status"
            defaultValue={values.watchStatus}
            className={fieldClasses}
          >
            <option value="">All statuses</option>
            {watchStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="lg:col-start-4">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
            Sort by
          </span>
          <select
            name="sort"
            defaultValue={values.sort}
            className={fieldClasses}
          >
            <option value="newest">Newest added</option>
            <option value="title">Title A–Z</option>
            <option value="rating">Highest rating</option>
          </select>
        </label>

        <button
          type="submit"
          className="self-end rounded-2xl bg-[#d65a4a] px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-[#c94f41]"
        >
          Show results
        </button>
      </form>
    </section>
  );
}
