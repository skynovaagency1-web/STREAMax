"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PlanId } from "@streamax/core";

/**
 * Viewer plan state.
 * - live mode (accounts configured): plan comes from the server profile, set by Stripe webhooks.
 * - demo mode: plan is kept in localStorage so free/paid can be previewed without accounts.
 */
interface PlanState {
  mode: "live" | "demo";
  plan: PlanId;
  signedIn: boolean;
  billing: boolean;
  setPlan: (p: PlanId) => void;
}

const PlanContext = createContext<PlanState>({
  mode: "demo",
  plan: "free",
  signedIn: false,
  billing: false,
  setPlan: () => {},
});

const KEY = "streamax.demoPlan";

export function PlanProvider({
  children,
  live,
  billing,
  viewerPlan,
  signedIn,
}: {
  children: React.ReactNode;
  live: boolean;
  billing: boolean;
  viewerPlan: PlanId;
  signedIn: boolean;
}) {
  const [demoPlan, setDemoPlan] = useState<PlanId>("free");

  useEffect(() => {
    if (live) return;
    try {
      const saved = localStorage.getItem(KEY) as PlanId | null;
      if (saved === "free" || saved === "standard" || saved === "premium") setDemoPlan(saved);
    } catch {}
  }, [live]);

  const setPlan = (p: PlanId) => {
    if (live) return;
    setDemoPlan(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {}
  };

  return (
    <PlanContext.Provider
      value={{ mode: live ? "live" : "demo", plan: live ? viewerPlan : demoPlan, signedIn, billing, setPlan }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => useContext(PlanContext);
