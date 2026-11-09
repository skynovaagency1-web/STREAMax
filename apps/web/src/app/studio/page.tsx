import type { Metadata } from "next";
import {
  CREATORS,
  CREATOR_SHARE,
  PLATFORM_SHARE,
  TITLES,
  computePayouts,
  getCreator,
  formatPrice,
} from "@streamax/core";
import { UploadForm } from "@/components/UploadForm";
import { KeyArt } from "@/components/KeyArt";

export const metadata: Metadata = { title: "Creator Studio" };

// Demo month: pool of creator-attributed revenue and watch minutes per creator.
const DEMO_POOL_CENTS = 1_250_000;
const DEMO_WATCH = [
  { creatorId: "c-ayo", minutes: 182_400 },
  { creatorId: "c-lina", minutes: 96_750 },
  { creatorId: "c-marco", minutes: 41_200 },
];
const ME = "c-ayo";

export default function StudioPage() {
  const payouts = computePayouts(DEMO_POOL_CENTS, DEMO_WATCH);
  const mine = payouts.lines.find((l) => l.creatorId === ME)!;
  const me = getCreator(ME)!;
  const myTitles = TITLES.filter((t) => t.source.type === "creator" && t.source.creatorId === ME);

  const stats = [
    { label: "Your earnings this month", value: formatPrice(mine.creatorCents), accent: true },
    { label: "Minutes watched", value: mine.minutes.toLocaleString("en-US") },
    { label: "Share of creator watch time", value: `${((mine.minutes / payouts.totalMinutes) * 100).toFixed(1)}%` },
    { label: "Published titles", value: String(myTitles.length) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wide text-amber uppercase">Creator Studio</p>
          <h1 className="font-display mt-1 text-3xl font-bold sm:text-4xl">Welcome back, {me.name.split(" ")[0]}</h1>
          <p className="mt-1 text-mist">
            You keep {Math.round(CREATOR_SHARE * 100)}% of the revenue your titles earn. Streamax keeps {Math.round(PLATFORM_SHARE * 100)}% to run the platform.
          </p>
        </div>
        <span className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-mist">Demo data · November 2026</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.accent ? "bg-ink-800 ring-1 ring-violet/60" : "border border-white/5 bg-ink-900"}`}>
            <p className="text-xs text-mist">{s.label}</p>
            <p className={`font-display mt-2 text-2xl font-bold ${s.accent ? "text-brand" : ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-3xl border border-white/5 bg-ink-900 p-6">
          <h2 className="font-display text-lg font-semibold">How this month splits</h2>
          <p className="mt-1 text-sm text-mist">
            Creator revenue pool of {formatPrice(DEMO_POOL_CENTS)}, shared by watch time.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-mist">
                <tr className="border-b border-white/10">
                  <th className="py-2 font-medium">Creator</th>
                  <th className="py-2 text-right font-medium">Minutes</th>
                  <th className="py-2 text-right font-medium">Revenue</th>
                  <th className="py-2 text-right font-medium">Creator 70%</th>
                  <th className="py-2 text-right font-medium">Streamax 30%</th>
                </tr>
              </thead>
              <tbody>
                {payouts.lines.map((l) => (
                  <tr key={l.creatorId} className={`border-b border-white/5 ${l.creatorId === ME ? "text-white" : "text-mist"}`}>
                    <td className="py-3">
                      {CREATORS.find((c) => c.id === l.creatorId)?.name}
                      {l.creatorId === ME && <span className="ml-2 text-xs text-amber">you</span>}
                    </td>
                    <td className="py-3 text-right">{l.minutes.toLocaleString("en-US")}</td>
                    <td className="py-3 text-right">{formatPrice(l.grossCents)}</td>
                    <td className="py-3 text-right font-semibold text-emerald-300">{formatPrice(l.creatorCents)}</td>
                    <td className="py-3 text-right">{formatPrice(l.platformCents)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="py-3">Total</td>
                  <td className="py-3 text-right">{payouts.totalMinutes.toLocaleString("en-US")}</td>
                  <td className="py-3 text-right">{formatPrice(payouts.poolCents)}</td>
                  <td className="py-3 text-right text-emerald-300">{formatPrice(payouts.creatorTotalCents)}</td>
                  <td className="py-3 text-right">{formatPrice(payouts.platformTotalCents)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <h3 className="font-display mt-8 font-semibold">Your titles</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {myTitles.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                <KeyArt title={t} showName={false} className="aspect-[2/3] w-12 rounded-lg" />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-mist">{t.kind === "movie" ? "Film" : "Series"} · {t.minPlan === "free" ? "Free with ads" : "Subscribers"} · Live</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <UploadForm />
      </div>
    </div>
  );
}
