"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Genre, MediaEntry } from "@/lib/library";
import { mediaTypes, streamingServices, watchStatuses } from "@/lib/library";
import type { EntryActionState } from "./actions";

type EntryAction = (
  state: EntryActionState,
  formData: FormData,
) => Promise<EntryActionState>;

const initialState: EntryActionState = {};

export function EntryForm({
  action,
  genres,
  entry,
}: {
  action: EntryAction;
  genres: Genre[];
  entry?: MediaEntry;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const cancelHref = entry ? `/library/${entry.id}` : "/library";

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-[#492740]">Title</span>
        <input
          name="title"
          defaultValue={entry?.title}
          maxLength={200}
          required
          autoFocus
          placeholder="What are you watching?"
          className="w-full rounded-2xl border border-[#6e3b5d]/20 bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm placeholder:text-[#6e3b5d]/45"
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Type
          </span>
          <select
            name="mediaType"
            defaultValue={entry?.media_type ?? ""}
            required
            className="w-full rounded-2xl border border-[#6e3b5d]/20 bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm"
          >
            <option value="" disabled>
              Choose a type
            </option>
            {mediaTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Genre
          </span>
          <select
            name="genreId"
            defaultValue={entry?.genre_id ?? ""}
            required
            className="w-full rounded-2xl border border-[#6e3b5d]/20 bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm"
          >
            <option value="" disabled>
              Choose a genre
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Where I&apos;m watching
          </span>
          <select
            name="streamingService"
            defaultValue={entry?.streaming_service ?? ""}
            className="w-full rounded-2xl border border-[#6e3b5d]/20 bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm"
          >
            <option value="">Not sure yet</option>
            {streamingServices.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-bold text-[#492740]">
          Watch status
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {watchStatuses.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#6e3b5d]/20 bg-white px-4 py-3.5 text-sm font-semibold text-[#261b2a] has-checked:border-[#d65a4a] has-checked:bg-[#d65a4a]/10"
            >
              <input
                type="radio"
                name="watchStatus"
                value={status}
                defaultChecked={entry?.watch_status === status}
                required
                className="accent-[#d65a4a]"
              />
              {status}
            </label>
          ))}
        </div>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="rounded-2xl border border-[#d65a4a]/30 bg-[#d65a4a]/10 px-4 py-3 text-sm font-semibold text-[#8b3028]"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="rounded-full border border-[#6e3b5d]/30 px-6 py-3 text-center font-bold text-[#492740] transition hover:bg-[#6e3b5d]/5"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#d65a4a] px-7 py-3 font-bold text-white shadow-lg shadow-[#d65a4a]/20 transition hover:bg-[#c94f41] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Saving…" : entry ? "Save changes" : "Add to library"}
        </button>
      </div>
    </form>
  );
}
