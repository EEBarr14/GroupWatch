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
  const formKey = state.values ? JSON.stringify(state.values) : "initial";
  const hasFieldErrors = Boolean(
    state.errors && Object.keys(state.errors).length > 0,
  );

  return (
    <form
      key={formKey}
      action={formAction}
      noValidate
      className="mt-8 space-y-6"
    >
      {hasFieldErrors && (
        <div
          role="alert"
          className="rounded-2xl border border-[#d65a4a]/30 bg-[#d65a4a]/10 px-4 py-3 text-sm text-[#8b3028]"
        >
          <p className="font-bold">A few details still need your attention.</p>
          <p className="mt-1">Your other answers are still here—just fix the fields marked below.</p>
        </div>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-[#492740]">Title</span>
        <input
          name="title"
          defaultValue={state.values?.title ?? entry?.title}
          maxLength={200}
          required
          autoFocus
          placeholder="What are you watching?"
          aria-invalid={Boolean(state.errors?.title)}
          aria-describedby={state.errors?.title ? "title-error" : undefined}
          className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm placeholder:text-[#6e3b5d]/45 ${state.errors?.title ? "border-[#d65a4a] ring-2 ring-[#d65a4a]/15" : "border-[#6e3b5d]/20"}`}
        />
        {state.errors?.title && (
          <span id="title-error" className="mt-2 block text-sm font-semibold text-[#8b3028]">
            {state.errors.title}
          </span>
        )}
      </label>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Type
          </span>
          <select
            name="mediaType"
            defaultValue={state.values?.mediaType ?? entry?.media_type ?? ""}
            required
            aria-invalid={Boolean(state.errors?.mediaType)}
            aria-describedby={state.errors?.mediaType ? "media-type-error" : undefined}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm ${state.errors?.mediaType ? "border-[#d65a4a] ring-2 ring-[#d65a4a]/15" : "border-[#6e3b5d]/20"}`}
          >
            <option value="" disabled>
              Choose a type
            </option>
            {mediaTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          {state.errors?.mediaType && (
            <span id="media-type-error" className="mt-2 block text-sm font-semibold text-[#8b3028]">
              {state.errors.mediaType}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Genre
          </span>
          <select
            name="genreId"
            defaultValue={state.values?.genreId ?? entry?.genre_id ?? ""}
            required
            aria-invalid={Boolean(state.errors?.genreId)}
            aria-describedby={state.errors?.genreId ? "genre-error" : undefined}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm ${state.errors?.genreId ? "border-[#d65a4a] ring-2 ring-[#d65a4a]/15" : "border-[#6e3b5d]/20"}`}
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
          {state.errors?.genreId && (
            <span id="genre-error" className="mt-2 block text-sm font-semibold text-[#8b3028]">
              {state.errors.genreId}
            </span>
          )}
        </label>

        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Where I&apos;m watching
          </span>
          <select
            name="streamingService"
            defaultValue={
              state.values?.streamingService ?? entry?.streaming_service ?? ""
            }
            aria-invalid={Boolean(state.errors?.streamingService)}
            aria-describedby={state.errors?.streamingService ? "streaming-service-error" : undefined}
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-[#261b2a] shadow-sm ${state.errors?.streamingService ? "border-[#d65a4a] ring-2 ring-[#d65a4a]/15" : "border-[#6e3b5d]/20"}`}
          >
            <option value="">Not sure yet</option>
            {streamingServices.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
          {state.errors?.streamingService && (
            <span id="streaming-service-error" className="mt-2 block text-sm font-semibold text-[#8b3028]">
              {state.errors.streamingService}
            </span>
          )}
        </label>
      </div>

      <fieldset
        aria-invalid={Boolean(state.errors?.watchStatus)}
        aria-describedby={state.errors?.watchStatus ? "watch-status-error" : undefined}
      >
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
                defaultChecked={
                  (state.values?.watchStatus ?? entry?.watch_status) === status
                }
                required
                className="accent-[#d65a4a]"
              />
              {status}
            </label>
          ))}
        </div>
        {state.errors?.watchStatus && (
          <p id="watch-status-error" className="mt-2 text-sm font-semibold text-[#8b3028]">
            {state.errors.watchStatus}
          </p>
        )}
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
