"use client";

import Link from "next/link";
import { useActionState } from "react";
import { WatchPartyLineArt } from "@/components/line-art";
import {
  requestPasswordReset,
  type PasswordResetRequestState,
} from "./actions";

const initialState: PasswordResetRequestState = {};

export function PasswordResetRequestForm({ linkExpired = false }: { linkExpired?: boolean }) {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <main className="flex min-h-screen items-center px-6 py-12 sm:px-10">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#fff1d6]/20 bg-[#fff1d6] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-[linear-gradient(155deg,#6e3b5d_0%,#d65a4a_58%,#f29e4c_100%)] p-8 text-[#fff1d6] sm:p-12">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.24em] text-[#fff1d6]"
          >
            GroupWatch
          </Link>
          <h1 className="mt-16 text-4xl font-semibold leading-tight sm:text-5xl">
            Let&apos;s get you back in.
          </h1>
          <p className="mt-5 max-w-sm text-lg leading-8 text-[#fff1d6]/85">
            I&apos;ll send a secure link to the email connected to your account.
          </p>
          <WatchPartyLineArt
            className="mt-8 w-full text-[#fff1d6]/85"
            accent="#f6c85f"
          />
        </section>

        <section className="p-8 text-[#261b2a] sm:p-12">
          <h2 className="text-3xl font-semibold">Reset my password</h2>
          <p className="mt-3 leading-7 text-[#6e3b5d]">
            Enter your account email and check your inbox for the next step.
          </p>
          {linkExpired && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-[#d65a4a]/35 bg-[#d65a4a]/10 px-4 py-3 text-sm font-semibold text-[#8b3028]"
            >
              That reset link is invalid or expired. Send yourself a new one.
            </p>
          )}
          <form action={formAction} className="mt-8 space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
                className="w-full rounded-xl border border-[#6e3b5d]/25 bg-white px-4 py-3.5 text-base shadow-sm"
              />
            </label>

            {state.error && (
              <p
                role="alert"
                className="rounded-xl border border-[#d65a4a]/35 bg-[#d65a4a]/10 px-4 py-3 text-sm font-semibold text-[#8b3028]"
              >
                {state.error}
              </p>
            )}
            {state.message && (
              <p
                role="status"
                className="rounded-xl border border-[#6e3b5d]/25 bg-[#6e3b5d]/10 px-4 py-3 text-sm font-semibold text-[#492740]"
              >
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-[#d65a4a] px-6 py-3.5 font-bold text-white transition hover:bg-[#c94f41] disabled:cursor-wait disabled:opacity-60"
            >
              {isPending ? "Sending link…" : "Send reset link"}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-7 inline-block text-sm font-bold text-[#6e3b5d] underline decoration-[#f29e4c] decoration-2 underline-offset-4"
          >
            Back to log in
          </Link>
        </section>
      </div>
    </main>
  );
}
