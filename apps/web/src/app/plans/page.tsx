import type { Metadata } from "next";
import { PlansGrid } from "@/components/PlansGrid";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-wide text-amber uppercase">Plans</p>
        <h1 className="font-display mt-2 text-4xl font-extrabold sm:text-5xl">Watch free. Or go all in.</h1>
        <p className="mx-auto mt-3 max-w-xl text-mist">
          Start with the free plan and short ad breaks. Upgrade any time for no ads, better quality and more screens.
        </p>
      </div>
      <PlansGrid />
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["Cancel anytime", "No contracts. Switch or cancel your plan from your account in two clicks."],
          ["Every screen", "Phone, tablet, laptop and TV. Pick up right where you left off."],
          ["Supports creators", `70% of revenue from creator titles goes straight to the people who made them.`],
        ].map(([h, p]) => (
          <div key={h} className="rounded-2xl border border-white/5 bg-ink-900 p-6">
            <h3 className="font-display font-semibold">{h}</h3>
            <p className="mt-1 text-sm text-mist">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
