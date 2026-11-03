import { Suspense } from "react";
import { AuthForm } from "@/app/auth/auth-form";

async function LoginContent({ searchParams }: PageProps<"/login">) {
  const query = await searchParams;
  return <AuthForm mode="login" passwordReset={query.passwordReset === "1"} />;
}

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6">
          <p className="font-semibold text-[#fff1d6]">Opening GroupWatch…</p>
        </main>
      }
    >
      <LoginContent {...props} />
    </Suspense>
  );
}
