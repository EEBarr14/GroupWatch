"use client";

import Link from "next/link";
import { useActionState } from "react";
import { DesertLineArt } from "@/components/line-art";
import { PasswordField } from "@/components/password-field";
import { updatePassword, type UpdatePasswordState } from "./actions";

const initialState: UpdatePasswordState = {};

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <section className="mx-auto w-full max-w-2xl rounded-[2rem] bg-[#fff1d6] p-8 text-[#261b2a] shadow-2xl sm:p-12">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d65a4a]">
        Account recovery
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Pick a new password.
      </h1>
      <p className="mt-4 text-lg leading-8 text-[#6e3b5d]">
        Choose something you&apos;ll remember and don&apos;t use on another account.
      </p>
      <DesertLineArt
        className="mt-2 h-24 w-full text-[#6e3b5d]/35"
        accent="#d65a4a"
      />

      <form action={formAction} className="mt-5 space-y-6">
        <PasswordField
          name="password"
          label="New password"
          autoComplete="new-password"
          minLength={8}
          required
          autoFocus
          helpText="Use at least 8 characters."
        />

        <PasswordField
          name="passwordConfirmation"
          label="Confirm new password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {state.error && (
          <p
            role="alert"
            className="rounded-xl border border-[#d65a4a]/35 bg-[#d65a4a]/10 px-4 py-3 text-sm font-semibold text-[#8b3028]"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#d65a4a] px-6 py-3.5 font-bold text-white transition hover:bg-[#c94f41] disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Updating password…" : "Save my new password"}
        </button>
      </form>

      <Link
        href="/forgot-password"
        className="mt-7 inline-block text-sm font-bold text-[#6e3b5d] underline decoration-[#f29e4c] decoration-2 underline-offset-4"
      >
        Request a different reset link
      </Link>
    </section>
  );
}
