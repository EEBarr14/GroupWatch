import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { DesertLineArt } from "@/components/line-art";
import { TvRatingDisplay } from "@/components/tv-rating";
import { createClient } from "@/lib/supabase/server";
import type { PublicWatchlist } from "@/lib/public-sharing";
import { statusClasses } from "@/lib/library";

async function SharedWatchlist({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_watchlist", {
    requested_slug: slug,
  });

  if (error || !data) {
    notFound();
  }

  const watchlist = data as unknown as PublicWatchlist;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(155deg,#2d1b3d_0%,#492740_55%,#8b4a59_100%)] px-5 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#f6c85f]/20 blur-3xl" />
      <DesertLineArt className="pointer-events-none absolute inset-x-0 bottom-0 w-full text-[#fff1d6]/10" />

      <main className="relative mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.24em] text-[#f6c85f]">
            GroupWatch
          </Link>
          <p className="rounded-full border border-[#fff1d6]/25 px-4 py-2 text-sm font-semibold text-[#fff1d6]/75">
            Read-only shared watchlist
          </p>
        </header>

        <section className="py-14 sm:py-20">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f29e4c]">
            Now showing
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[#fff1d6] sm:text-6xl">
            {watchlist.display_name}&apos;s watchlist
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#fff1d6]/65">
            {watchlist.entries.length === 1
              ? "One movie or show shared from GroupWatch."
              : `${watchlist.entries.length} movies and shows shared from GroupWatch.`}
          </p>
        </section>

        {watchlist.entries.length === 0 ? (
          <section className="rounded-[2rem] bg-[#fff1d6] p-8 text-center text-[#261b2a] shadow-2xl sm:p-12">
            <h2 className="text-3xl font-semibold">Nothing shared here yet.</h2>
            <p className="mt-3 text-[#6e3b5d]">Check back after this watchlist has a title or two.</p>
          </section>
        ) : (
          <section aria-label="Shared titles" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {watchlist.entries.map((entry, index) => (
              <article
                key={`${entry.title}-${index}`}
                className="flex min-h-60 flex-col rounded-[1.75rem] border border-[#fff1d6]/20 bg-[#fff1d6] p-6 text-[#261b2a] shadow-xl"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#6e3b5d]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
                    {entry.media_type}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses(entry.watch_status)}`}>
                    {entry.watch_status}
                  </span>
                </div>
                <div className="my-auto py-8">
                  <h2 className="text-2xl font-semibold leading-tight">{entry.title}</h2>
                  <p className="mt-3 text-sm font-semibold text-[#6e3b5d]">{entry.genre}</p>
                  {entry.rating && (
                    <div className="mt-4 text-[#d65a4a]">
                      <TvRatingDisplay rating={entry.rating} compact />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <footer className="mt-14 border-t border-[#fff1d6]/15 py-8 text-center text-sm text-[#fff1d6]/60">
          Shared from GroupWatch. Private notes and account details are not included.
        </footer>
      </main>
    </div>
  );
}

export default function PublicSharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#2d1b3d] px-6">
          <p className="font-semibold text-[#fff1d6]">Opening this shared watchlist…</p>
        </main>
      }
    >
      <SharedWatchlist params={params} />
    </Suspense>
  );
}
