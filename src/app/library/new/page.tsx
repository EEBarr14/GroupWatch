import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import type { Genre } from "@/lib/library";
import { createClient } from "@/lib/supabase/server";
import { createEntry } from "../actions";
import { EntryForm } from "../entry-form";
import { DesertLineArt } from "@/components/line-art";

async function NewEntryContent() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase
    .from("genres")
    .select("id, name")
    .order("name");
  const genres = (data ?? []) as Genre[];

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/library"
        className="text-sm font-bold text-[#f6c85f] hover:underline"
      >
        ← Back to my library
      </Link>
      <div className="mt-6 rounded-[2rem] bg-[#fff1d6] p-7 text-[#261b2a] shadow-2xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d65a4a]">
          New entry
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          What&apos;s next?
        </h1>
        <p className="mt-4 text-lg text-[#6e3b5d]">
          Add the basics now. You can always come back and change them.
        </p>
        <DesertLineArt
          className="mt-2 h-24 w-full text-[#6e3b5d]/35"
          accent="#d65a4a"
        />
        <EntryForm action={createEntry} genres={genres} />
      </div>
    </section>
  );
}

export default function NewEntryPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-3xl rounded-[2rem] bg-[#fff1d6]/15 p-10 text-[#fff1d6]">
          <p className="font-semibold">Opening the add-title form…</p>
        </section>
      }
    >
      <NewEntryContent />
    </Suspense>
  );
}
