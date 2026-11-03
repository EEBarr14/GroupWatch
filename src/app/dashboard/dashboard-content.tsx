import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  calculateDashboardSummary,
  type DashboardEntry,
} from "@/lib/dashboard";
import { WatchStatusChart } from "./watch-status-chart";

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[#fff1d6]/20 bg-[#fff1d6] p-6 text-[#261b2a] shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#6e3b5d]">{note}</p>
    </article>
  );
}

export async function DashboardContent() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_entries")
    .select("watch_status, rating");

  const entries = error ? [] : ((data ?? []) as DashboardEntry[]);
  const summary = calculateDashboardSummary(entries);
  const averageLabel =
    summary.averageRating === null ? "—" : summary.averageRating.toFixed(1);

  return (
    <>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">
          My dashboard
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[#fff1d6] sm:text-6xl">
          A quick look at my watching habits.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#fff1d6]/65">
          The totals update as I add titles, change their status, and save ratings.
        </p>
      </section>

      {error && (
        <p
          role="alert"
          className="mt-8 rounded-2xl border border-[#fff1d6]/20 bg-[#fff1d6] px-5 py-4 font-semibold text-[#8b3028]"
        >
          I couldn&apos;t load the dashboard totals. Please refresh and try again.
        </p>
      )}

      <section aria-label="Watchlist summary" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total titles"
          value={summary.totalCount}
          note="Everything currently in my library"
        />
        <MetricCard
          label="Watched"
          value={summary.watchedCount}
          note="Movies and shows I have finished"
        />
        <MetricCard
          label="Watching now"
          value={summary.watchingCount}
          note="Titles currently in progress"
        />
        <MetricCard
          label="Average rating"
          value={averageLabel}
          note={
            summary.ratedCount === 0
              ? "No ratings saved yet"
              : `Across ${summary.ratedCount} rated ${summary.ratedCount === 1 ? "title" : "titles"}`
          }
        />
      </section>

      <section
        aria-labelledby="status-chart-heading"
        className="mt-8 rounded-[2rem] border border-[#fff1d6]/20 bg-[#fff1d6] p-6 text-[#261b2a] shadow-2xl sm:p-9"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d65a4a]">
          Watch status
        </p>
        <h2 id="status-chart-heading" className="mt-2 text-3xl font-semibold">
          Where everything stands
        </h2>
        <p className="mt-3 text-[#6e3b5d]">
          A count of titles at each point in the watch journey.
        </p>
        <div className="mt-6">
          <WatchStatusChart data={summary.statusCounts} />
        </div>
      </section>
    </>
  );
}
