"use client";

import { useState } from "react";
import { PLANS, formatPrice } from "@streamax/core";
import { usePlan } from "./PlanProvider";

export function PlansGrid() {
  const [yearly, setYearly] = useState(false);
  const { plan: current, setPlan } = usePlan();

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
              <button
                onClick={() => setPlan(p.id)}
                disabled={isCurrent}
                className={`mt-8 rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-default ${
                  isCurrent
                    ? "border border-white/15 text-mist"
                    : popular
                      ? "brand-gradient text-ink-950 hover:opacity-90"
                      : "bg-white text-ink-950 hover:bg-white/90"
                }`}
              >
                {isCurrent ? "Current plan" : p.id === "free" ? "Switch to Free" : `Choose ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-mist/70">
        Demo mode: choosing a plan switches it instantly so you can preview the experience. Checkout via Stripe comes next.
      </p>
    </>
  );
}
