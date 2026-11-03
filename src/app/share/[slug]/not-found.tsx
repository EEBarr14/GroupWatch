import Link from "next/link";

export default function SharedWatchlistNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(155deg,#2d1b3d_0%,#6e3b5d_100%)] px-6 text-center text-[#fff1d6]">
      <div className="max-w-xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f6c85f]">GroupWatch</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">This watchlist isn&apos;t available.</h1>
        <p className="mt-4 text-lg leading-8 text-[#fff1d6]/70">
          The link may be incorrect, or its owner may have turned sharing off.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-[#f6c85f] px-6 py-3 font-bold text-[#261b2a]">
          Go to GroupWatch
        </Link>
      </div>
    </main>
  );
}
