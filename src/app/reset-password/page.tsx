import { Suspense } from "react";
import { ResetPasswordContent } from "./reset-password-content";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center bg-[linear-gradient(160deg,#2d1b3d_0%,#6e3b5d_100%)] px-6 py-12 sm:px-10">
      <Suspense
        fallback={
          <p className="mx-auto font-semibold text-[#fff1d6]">
            Opening your reset link…
          </p>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
