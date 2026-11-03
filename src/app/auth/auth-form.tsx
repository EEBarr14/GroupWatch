"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "./actions";
import { logIn, signUp } from "./actions";
import { WatchPartyLineArt } from "@/components/line-art";
import { PasswordField } from "@/components/password-field";

const initialState: AuthState = {};

export function AuthForm({
  mode,
  passwordReset = false,
}: {
  mode: "login" | "signup";
  passwordReset?: boolean;
}) {
  const isLogin = mode === "login";
  const action = isLogin ? logIn : signUp;
  const [state, formAction, isPending] = useActionState(action, initialState);

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
            {isLogin ? "Welcome back." : "Let's start your watchlist."}
          </h1>
          <p className="mt-5 max-w-sm text-lg leading-8 text-[#fff1d6]/85">
            {isLogin
              ? "Log in to get back to the shows and movies you have been tracking."
              : "Create an account so your watchlist stays connected to you."}
          </p>
          <WatchPartyLineArt
            className="mt-8 w-full text-[#fff1d6]/85"
            accent="#f6c85f"
          />
        </section>

        <section className="p-8 text-[#261b2a] sm:p-12">
          <h2 className="text-3xl font-semibold">
            {isLogin ? "Log in" : "Create an account"}
          </h2>
          {passwordReset && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-[#6e3b5d]/25 bg-[#6e3b5d]/10 px-4 py-3 text-sm font-semibold text-[#492740]"
            >
              Your password is updated. Log in with the new one.
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
                className="w-full rounded-xl border border-[#6e3b5d]/25 bg-white px-4 py-3.5 text-base shadow-sm"
              />
            </label>
            <div>
              <PasswordField
                name="password"
                label="Password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
                helpText={!isLogin ? "Use at least 8 characters." : undefined}
              />
              {isLogin && (
                <Link
                  href="/forgot-password"
                  className="mt-3 inline-block text-sm font-bold text-[#6e3b5d] underline decoration-[#f29e4c] decoration-2 underline-offset-4"
                >
                  Forgot your password?
                </Link>
              )}
            </div>

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
              {isPending
                ? isLogin
                  ? "Logging in…"
                  : "Creating account…"
                : isLogin
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-sm text-[#6e3b5d]">
            {isLogin ? "New to GroupWatch?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="font-bold underline decoration-[#f29e4c] decoration-2 underline-offset-4"
            >
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
