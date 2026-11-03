import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import type { MediaEntry } from "@/lib/library";
import { genreName, statusClasses } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";
import { deleteEntry } from "../actions";
import { DeleteEntryForm } from "../delete-entry-form";
import { DesertLineArt } from "@/components/line-art";

async function EntryDetailContent({
  params,
  searchParams,
}: PageProps<"/library/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_entries")
    .select(
      "id, title, media_type, watch_status, streaming_service, genre_id, created_at, updated_at, genres(name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    redirect("/library");
  }

  const entry = data as MediaEntry;
  const deleteAction = deleteEntry.bind(null, entry.id);

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        href="/library"
        className="text-sm font-bold text-[#f6c85f] hover:underline"
      >
        ← Back to my library
      </Link>
      <article className="mt-6 overflow-hidden rounded-[2rem] bg-[#fff1d6] text-[#261b2a] shadow-2xl">
        <div className="h-3 bg-[linear-gradient(90deg,#6e3b5d_0%,#d65a4a_50%,#f6c85f_100%)]" />
        <div className="p-7 sm:p-11">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#6e3b5d]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#6e3b5d]">
              {entry.media_type}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses(entry.watch_status)}`}
            >
              {entry.watch_status}
            </span>
          </div>
          <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            {entry.title}
          </h1>
          <DesertLineArt
            className="mt-3 h-24 w-full text-[#6e3b5d]/30"
            accent="#d65a4a"
          />
          <dl className="mt-10 grid gap-5 border-y border-[#6e3b5d]/15 py-7 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
                Genre
              </dt>
              <dd className="mt-2 text-lg font-semibold">
                {genreName(entry)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
                Watching on
              </dt>
              <dd className="mt-2 text-lg font-semibold">
                {entry.streaming_service ?? "Not noted yet"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
                Added
              </dt>
              <dd className="mt-2 text-lg font-semibold">
                {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
                  new Date(entry.created_at),
                )}
              </dd>
            </div>
          </dl>

          {query.deleteError === "1" && (
            <p
              role="alert"
              className="mt-6 rounded-2xl bg-[#d65a4a]/10 px-4 py-3 text-sm font-semibold text-[#8b3028]"
            >
              I couldn&apos;t delete that title. Please try again.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <DeleteEntryForm action={deleteAction} title={entry.title} />
            <Link
              href={`/library/${entry.id}/edit`}
              className="rounded-full bg-[#d65a4a] px-6 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#c94f41]"
            >
              Edit details
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

export default function EntryDetailPage(props: PageProps<"/library/[id]">) {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-4xl rounded-[2rem] bg-[#fff1d6]/15 p-10 text-[#fff1d6]">
          <p className="font-semibold">Opening the title details…</p>
        </section>
      }
    >
      <EntryDetailContent {...props} />
    </Suspense>
  );
}
