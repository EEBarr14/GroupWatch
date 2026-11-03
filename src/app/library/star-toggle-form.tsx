"use client";

import { useActionState } from "react";
import type { StarActionState } from "./actions";

type StarAction = (
  state: StarActionState,
  formData: FormData,
) => Promise<StarActionState>;

const initialState: StarActionState = {};

export function StarToggleForm({
  action,
  initiallyStarred,
  title,
  showMessage = false,
}: {
  action: StarAction;
  initiallyStarred: boolean;
  title: string;
  showMessage?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isStarred = state.isStarred ?? initiallyStarred;

  return (
    <form action={formAction} className="flex flex-col items-end">
      <button
        type="submit"
        name="starred"
        value={String(!isStarred)}
        aria-label={`${isStarred ? "Unstar" : "Star"} ${title}`}
        aria-pressed={isStarred}
        disabled={isPending}
        className={`flex h-11 w-11 items-center justify-center rounded-full border text-2xl leading-none shadow-sm transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 ${
          isStarred
            ? "border-[#d65a4a] bg-[#d65a4a] text-[#fff1d6]"
            : "border-[#6e3b5d]/25 bg-white/70 text-[#6e3b5d] hover:border-[#d65a4a] hover:text-[#d65a4a]"
        }`}
      >
        <span aria-hidden="true">{isStarred ? "★" : "☆"}</span>
      </button>
      {showMessage && isPending && (
        <span role="status" className="mt-2 text-xs font-semibold text-[#6e3b5d]">
          Updating…
        </span>
      )}
      {showMessage && !isPending && state.message && (
        <span role="status" className="mt-2 text-xs font-semibold text-[#3e6549]">
          {state.message}
        </span>
      )}
      {state.error && (
        <span role="alert" className="mt-2 max-w-48 text-right text-xs font-semibold text-[#8b3028]">
          {state.error}
        </span>
      )}
    </form>
  );
}
