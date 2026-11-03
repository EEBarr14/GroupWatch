import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-6 py-16 sm:px-10">
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(circle_at_50%_100%,#f6c85f_0%,#f29e4c_28%,#d65a4a_52%,transparent_75%)] opacity-80" />
      <div className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#f6c85f]/20 blur-3xl" />
      <section className="relative mx-auto w-full max-w-5xl rounded-[2rem] border border-[#fff1d6]/25 bg-[#2d1b3d]/85 p-8 shadow-2xl backdrop-blur sm:p-14">
        <p className="mb-10 text-sm font-bold uppercase tracking-[0.28em] text-[#f6c85f]">
          GroupWatch
        </p>
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-[#fff1d6] sm:text-7xl">
            Your watchlist, with a little more personality.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#fff1d6]/80 sm:text-xl">
            Keep track of the shows and movies you want to watch, what you are
            watching now, and what you actually thought when you finished.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-[#d65a4a] px-7 py-3.5 text-center font-bold text-white transition hover:bg-[#e46b59]"
          >
            Start my watchlist
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[#fff1d6]/50 px-7 py-3.5 text-center font-bold text-[#fff1d6] transition hover:bg-[#fff1d6]/10"
          >
            I already have an account
          </Link>
        </div>
      </section>
    </main>
  );
}
