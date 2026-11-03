"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  updateShareSettings,
  type ShareSettingsActionState,
} from "./actions";

const initialState: ShareSettingsActionState = {};

export function ShareSettingsForm({
  displayName,
  shareSlug,
  shareEnabled,
}: {
  displayName: string;
  shareSlug: string;
  shareEnabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateShareSettings,
    initialState,
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const currentSlug = state.values?.shareSlug ?? shareSlug;
  const currentEnabled = state.values?.shareEnabled ?? shareEnabled;
  const sharePath = currentSlug ? `/share/${currentSlug}` : "";

  async function copyLink() {
    if (!sharePath) return;

    try {
      await navigator.clipboard.writeText(`${window.location.origin}${sharePath}`);
      setCopyError(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <form
        key={state.values ? JSON.stringify(state.values) : "initial"}
        action={formAction}
        noValidate
        className="space-y-6 rounded-[2rem] bg-[#fff1d6] p-6 text-[#261b2a] shadow-2xl sm:p-9"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Public display name
          </span>
          <input
            name="displayName"
            defaultValue={state.values?.displayName ?? displayName}
            maxLength={80}
            required
            aria-invalid={Boolean(state.errors?.displayName)}
            aria-describedby={
              state.errors?.displayName ? "display-name-error" : "display-name-help"
            }
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-base shadow-sm ${state.errors?.displayName ? "border-[#d65a4a] ring-2 ring-[#d65a4a]/15" : "border-[#6e3b5d]/20"}`}
          />
          <span id="display-name-help" className="mt-2 block text-sm text-[#6e3b5d]">
            This is the only account name shown to visitors. Your email stays private.
          </span>
          {state.errors?.displayName && (
            <span id="display-name-error" className="mt-2 block text-sm font-semibold text-[#8b3028]">
              {state.errors.displayName}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#492740]">
            Public link name
          </span>
          <div className="flex items-center rounded-2xl border border-[#6e3b5d]/20 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#d65a4a]/25">
            <span className="hidden pl-4 text-sm text-[#6e3b5d] sm:inline">/share/</span>
            <input
              name="shareSlug"
              defaultValue={currentSlug}
              minLength={3}
              maxLength={48}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              aria-invalid={Boolean(state.errors?.shareSlug)}
              aria-describedby={state.errors?.shareSlug ? "share-slug-error" : "share-slug-help"}
              className="min-w-0 flex-1 rounded-2xl bg-transparent px-4 py-3.5 text-base outline-none sm:pl-1"
            />
          </div>
          <span id="share-slug-help" className="mt-2 block text-sm text-[#6e3b5d]">
            Lowercase letters, numbers, and hyphens work best.
          </span>
          {state.errors?.shareSlug && (
            <span id="share-slug-error" className="mt-2 block text-sm font-semibold text-[#8b3028]">
              {state.errors.shareSlug}
            </span>
          )}
        </label>

        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#6e3b5d]/20 bg-white p-4">
          <input
            type="checkbox"
            name="shareEnabled"
            defaultChecked={currentEnabled}
            className="mt-1 h-5 w-5 accent-[#d65a4a]"
          />
          <span>
            <span className="block font-bold">Share my watchlist</span>
            <span className="mt-1 block text-sm leading-6 text-[#6e3b5d]">
              Anyone with the link can read the safe fields listed here. They cannot edit anything.
            </span>
          </span>
        </label>

        {state.error && (
          <p role="alert" className="rounded-2xl bg-[#d65a4a]/10 px-4 py-3 text-sm font-semibold text-[#8b3028]">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="rounded-2xl bg-[#f6c85f]/25 px-4 py-3 text-sm font-semibold text-[#492740]">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#d65a4a] px-7 py-3 font-bold text-white shadow-lg shadow-[#d65a4a]/20 transition hover:bg-[#c94f41] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Saving…" : "Save sharing settings"}
        </button>
      </form>

      <aside className="rounded-[2rem] border border-[#fff1d6]/20 bg-[#2d1b3d]/55 p-6 text-[#fff1d6] shadow-xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6c85f]">
          What friends can see
        </p>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-[#fff1d6]/80">
          <li>Display name</li>
          <li>Title and media type</li>
          <li>Watch status, rating, and genre</li>
        </ul>
        <p className="mt-6 border-t border-[#fff1d6]/15 pt-6 text-sm leading-6 text-[#fff1d6]/65">
          Your email, reviews, dates, streaming service, stars, and editing controls stay private.
        </p>

        {currentEnabled && sharePath && (
          <div className="mt-7 space-y-3">
            <Link
              href={sharePath}
              target="_blank"
              className="block rounded-full bg-[#f6c85f] px-5 py-3 text-center font-bold text-[#261b2a]"
            >
              Open public page
            </Link>
            <button
              type="button"
              onClick={copyLink}
              className="w-full rounded-full border border-[#fff1d6]/30 px-5 py-3 font-bold"
            >
              {copied ? "Link copied" : "Copy public link"}
            </button>
            {copyError && (
              <p role="alert" className="text-sm text-[#fff1d6]/75">
                I couldn&apos;t copy automatically. Open the public page and copy its address instead.
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
