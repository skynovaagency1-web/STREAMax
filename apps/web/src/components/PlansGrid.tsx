"use client";

import Link from "next/link";
import { useState } from "react";
import { PLANS, formatPrice } from "@streamax/core";
import { usePlan } from "./PlanProvider";

export function PlansGrid() {
  const [yearly, setYearly] = useState(false);
  const { plan: current, setPlan, mode, billing } = usePlan();

  return (
    <>
      <div className="mt-8 flex justify-center">
        <div className="flex rounded-2xl bg-white/5 p-1 text-sm">
          <button onClick={() => setYearly(false)} className={`rounded-xl px-4 py-2 ${!yearly ? "bg-white/15" : "text-mist"}`}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)} className={`rounded-xl px-4 py-2 ${yearly ? "bg-white/15" : "text-mist"}`}>
            Yearly <span className="text-amber">· 2 months free</span>
          </button>
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => {
          const popular = p.id === "standard";
          const price = yearly ? p.priceYearlyCents : p.priceMonthlyCents;
          const isCurrent = p.id === current;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-3xl p-7 ${
                popular ? "bg-ink-800 ring-2 ring-violet" : "border border-white/10 bg-ink-900"
              }`}
            >
              {popular && (
                <span className="brand-gradient absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-bold text-ink-950">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-xl font-bold">{p.name}</h2>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold">{formatPrice(price)}</span>
                {price > 0 && <span className="text-mist">/{yearly ? "year" : "month"}</span>}
              </p>
              <p className="mt-1 text-sm text-mist">
                {p.ads ? "With ads" : "No ads"} · {p.maxQuality} · {p.screens} screen{p.screens > 1 ? "s" : ""}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5 5 9-10" /></svg>
                    {h}
                  </li>
                ))}
              </ul>
              {mode === "live" ? (
                <PlanAction planId={p.id} name={p.name} yearly={yearly} isCurrent={isCurrent} popular={popular} billing={billing} />
              ) : (
                <button
                  onClick={() => setPlan(p.id)}
                  disabled={isCurrent}
                  className={buttonClass(isCurrent, popular)}
                >
                  {isCurrent ? "Current plan" : p.id === "free" ? "Switch to Free" : `Choose ${p.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {mode === "demo" && (
        <p className="mt-4 text-center text-xs text-mist/70">
          Demo mode: choosing a plan switches it instantly so you can preview the experience.
        </p>
      )}
    </>
  );
}

function buttonClass(isCurrent: boolean, popular: boolean) {
  return `mt-8 block w-full rounded-2xl px-5 py-3 text-center font-semibold transition disabled:cursor-default ${
    isCurrent
      ? "border border-white/15 text-mist"
      : popular
        ? "brand-gradient text-ink-950 hover:opacity-90"
        : "bg-white text-ink-950 hover:bg-white/90"
  }`;
}

/** Live mode: paid plans go to Stripe Checkout; Free and plan changes go through the account page. */
function PlanAction({
  planId,
  name,
  yearly,
  isCurrent,
  popular,
  billing,
}: {
  planId: string;
  name: string;
  yearly: boolean;
  isCurrent: boolean;
  popular: boolean;
  billing: boolean;
}) {
  if (isCurrent) return <button disabled className={buttonClass(true, popular)}>Current plan</button>;
  if (planId === "free") {
    return <Link href="/account" className={buttonClass(false, popular)}>Manage plan</Link>;
  }
  if (!billing) return <button disabled className={buttonClass(true, popular)}>Coming soon</button>;
  return (
    <form action="/api/checkout" method="post">
      <input type="hidden" name="plan" value={planId} />
      <input type="hidden" name="interval" value={yearly ? "yearly" : "monthly"} />
      <button className={buttonClass(false, popular)}>Choose {name}</button>
    </form>
  );
}
