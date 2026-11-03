"use client";

import { useActionState } from "react";
import type { WatchStatus } from "@/lib/library";
import { watchStatuses } from "@/lib/library";
import type { WatchStatusActionState } from "./actions";

type WatchStatusAction = (
  state: WatchStatusActionState,
  formData: FormData,
) => Promise<WatchStatusActionState>;

const initialState: WatchStatusActionState = {};

export function WatchStatusForm({
  action,
  currentStatus,
}: {
  action: WatchStatusAction;
  currentStatus: WatchStatus;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const selectedStatus = state.updatedStatus ?? currentStatus;

  return (
    <section className="mt-8 rounded-[1.5rem] border border-[#6e3b5d]/15 bg-white/55 p-5 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
          Watch status
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Where are you with this one?</h2>
        <p className="mt-2 text-sm leading-6 text-[#6e3b5d]">
          Move it forward—or back—without opening the full edit form.
        </p>
      </div>

      <form action={formAction} className="mt-5 grid gap-3 sm:grid-cols-3">
        {watchStatuses.map((status) => {
          const isCurrent = selectedStatus === status;

          return (
            <button
              key={status}
              type="submit"
              name="watchStatus"
              value={status}
              aria-pressed={isCurrent}
              disabled={isPending || isCurrent}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                isCurrent
                  ? "border-[#d65a4a] bg-[#d65a4a] text-white shadow-md shadow-[#d65a4a]/20"
                  : "border-[#6e3b5d]/20 bg-white text-[#492740] hover:border-[#d65a4a] hover:bg-[#d65a4a]/5"
              } disabled:cursor-default disabled:opacity-100`}
            >
              {isCurrent && <span aria-hidden="true">✓ </span>}
              {status}
            </button>
          );
        })}
      </form>

      {isPending && (
        <p role="status" className="mt-4 text-sm font-semibold text-[#6e3b5d]">
          Updating your watch status…
        </p>
      )}
      {!isPending && state.message && (
        <p role="status" className="mt-4 text-sm font-semibold text-[#3e6549]">
          {state.message}
        </p>
      )}
      {state.error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-[#8b3028]">
          {state.error}
        </p>
      )}
    </section>
  );
}
