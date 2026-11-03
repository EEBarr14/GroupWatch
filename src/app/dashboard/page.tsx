import { Suspense } from "react";
import { DashboardContent } from "./dashboard-content";
import { LibraryShell } from "@/app/library/library-shell";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6">
          <p className="font-semibold text-[#fff1d6]">Opening your watchlist…</p>
        </main>
      }
    >
      <LibraryShell>
        <DashboardContent />
      </LibraryShell>
    </Suspense>
  );
}
