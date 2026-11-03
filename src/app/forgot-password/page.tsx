import { Suspense } from "react";
import { PasswordResetRequestForm } from "./password-reset-request-form";

async function ForgotPasswordContent({
  searchParams,
}: PageProps<"/forgot-password">) {
  const query = await searchParams;
  return <PasswordResetRequestForm linkExpired={query.error === "expired"} />;
}

export default function ForgotPasswordPage(
  props: PageProps<"/forgot-password">,
) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6">
          <p className="font-semibold text-[#fff1d6]">Opening GroupWatch…</p>
        </main>
      }
    >
      <ForgotPasswordContent {...props} />
    </Suspense>
  );
}
