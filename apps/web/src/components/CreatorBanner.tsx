import Link from "next/link";
import { CREATOR_SHARE } from "@streamax/core";

export function CreatorBanner() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800 p-8 sm:p-10">
        <div className="brand-gradient absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold tracking-wide text-amber uppercase">For filmmakers</p>
            <h2 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
              Upload your film. Keep {Math.round(CREATOR_SHARE * 100)}% of what it earns.
            </h2>
            <p className="mt-2 max-w-2xl text-mist">
              Streamax shares subscription and ad revenue with creators based on watch time. Paid out monthly.
            </p>
          </div>
          <Link href="/studio" className="rounded-2xl bg-white px-6 py-3 text-center font-semibold text-ink-950 hover:bg-white/90">
            Open Creator Studio
          </Link>
        </div>
      </div>
    </section>
  );
}
