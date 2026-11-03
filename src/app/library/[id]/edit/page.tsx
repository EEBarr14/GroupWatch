import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import type { Genre, MediaEntry } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";
import { updateEntry } from "../../actions";
import { EntryForm } from "../../entry-form";
import { DesertLineArt } from "@/components/line-art";

async function EditEntryContent({
  params,
}: PageProps<"/library/[id]/edit">) {
  const { id } = await params;
  await connection();
  const supabase = await createClient();
  const [{ data: entryData }, { data: genreData }] = await Promise.all([
    supabase
      .from("media_entries")
      .select(
        "id, title, media_type, watch_status, streaming_service, rating, review, genre_id, created_at, updated_at, genres(name)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("genres").select("id, name").order("name"),
  ]);

  if (!entryData) {
    redirect("/library");
  }

  const entry = entryData as MediaEntry;
  const genres = (genreData ?? []) as Genre[];
  const updateAction = updateEntry.bind(null, entry.id);

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href={`/library/${entry.id}`}
        className="text-sm font-bold text-[#f6c85f] hover:underline"
      >
        ← Back to details
      </Link>
      <div className="mt-6 rounded-[2rem] bg-[#fff1d6] p-7 text-[#261b2a] shadow-2xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d65a4a]">
          Edit entry
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Make a change.
        </h1>
        <p className="mt-4 text-lg text-[#6e3b5d]">
          Update the details for <span className="font-bold">{entry.title}</span>.
        </p>
        <DesertLineArt
          className="mt-2 h-24 w-full text-[#6e3b5d]/35"
          accent="#d65a4a"
        />
        <EntryForm action={updateAction} genres={genres} entry={entry} />
      </div>
    </section>
  );
}

export default function EditEntryPage(
  props: PageProps<"/library/[id]/edit">,
) {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-3xl rounded-[2rem] bg-[#fff1d6]/15 p-10 text-[#fff1d6]">
          <p className="font-semibold">Opening the edit form…</p>
        </section>
      }
    >
      <EditEntryContent {...props} />
    </Suspense>
  );
}
