import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { logOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { DesertLineArt } from "@/components/line-art";

export async function LibraryShell({ children }: { children: React.ReactNode }) {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#2d1b3d_0%,#422348_52%,#6e3b5d_100%)]">
      <div className="pointer-events-none absolute -right-32 -top-36 h-96 w-96 rounded-full bg-[#f6c85f]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-32 h-[32rem] w-[32rem] rounded-full bg-[#d65a4a]/25 blur-3xl" />
      <DesertLineArt
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full text-[#fff1d6]/10"
        accent="#f29e4c"
      />

      <header className="relative border-b border-[#fff1d6]/15 bg-[#2d1b3d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-8">
            <Link
              href="/library"
              className="text-sm font-black uppercase tracking-[0.24em] text-[#f6c85f]"
            >
              GroupWatch
            </Link>
            <nav
              aria-label="Main navigation"
              className="flex flex-wrap items-center gap-1"
            >
              <Link
                href="/library"
                className="rounded-full px-3 py-2 text-sm font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10 sm:px-4"
              >
                Library
              </Link>
              <Link
                href="/library/new"
                className="rounded-full px-3 py-2 text-sm font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10 sm:px-4"
              >
                Add a title
              </Link>
              <Link
                href="/library/starred"
                className="rounded-full px-3 py-2 text-sm font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10 sm:px-4"
              >
                Starred
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-2 text-sm font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10 sm:px-4"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden max-w-40 truncate text-sm text-[#fff1d6]/65 sm:block">
              {profile?.display_name ?? "My watchlist"}
            </p>
            <form action={logOut}>
              <button
                type="submit"
                className="rounded-full border border-[#fff1d6]/35 px-4 py-2 text-sm font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
