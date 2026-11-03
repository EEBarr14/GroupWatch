import { Suspense } from "react";
import { LibraryShell } from "./library-shell";

export default function LibraryLayout({ children }: LayoutProps<"/library">) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#2d1b3d] px-6">
          <p className="font-semibold text-[#fff1d6]">Opening your library…</p>
        </main>
      }
    >
      <LibraryShell>{children}</LibraryShell>
    </Suspense>
  );
}
