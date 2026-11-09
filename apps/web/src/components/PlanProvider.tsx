"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PlanId } from "@streamax/core";

/**
 * Demo-only plan state. Until auth and Stripe are wired up, the viewer's plan
 * is kept in localStorage so the free/paid experience can be previewed.
 */
const PlanContext = createContext<{ plan: PlanId; setPlan: (p: PlanId) => void }>({
  plan: "free",
  setPlan: () => {},
});

const KEY = "streamax.demoPlan";

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<PlanId>("free");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as PlanId | null;
      if (saved === "free" || saved === "standard" || saved === "premium") setPlanState(saved);
    } catch {}
  }, []);

  const setPlan = (p: PlanId) => {
    setPlanState(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {}
  };

  return <PlanContext.Provider value={{ plan, setPlan }}>{children}</PlanContext.Provider>;
}

export const usePlan = () => useContext(PlanContext);
