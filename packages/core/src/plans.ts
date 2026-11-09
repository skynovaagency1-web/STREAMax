import type { Plan, PlanId } from "./types";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthlyCents: 0,
    priceYearlyCents: 0,
    ads: true,
    maxQuality: "720p",
    screens: 1,
    downloads: false,
    highlights: ["Watch the free catalogue", "Short ad breaks", "HD 720p on one screen"],
  },
  {
    id: "standard",
    name: "Standard",
    priceMonthlyCents: 799,
    priceYearlyCents: 7990,
    ads: false,
    maxQuality: "1080p",
    screens: 2,
    downloads: true,
    highlights: ["The full catalogue, no ads", "Full HD 1080p on two screens", "Downloads on mobile"],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthlyCents: 1299,
    priceYearlyCents: 12990,
    ads: false,
    maxQuality: "4K HDR",
    screens: 4,
    downloads: true,
    highlights: ["Everything in Standard", "4K HDR and spatial audio", "Four screens at once", "Early access premieres"],
  },
];

const RANK: Record<PlanId, number> = { free: 0, standard: 1, premium: 2 };

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

/** True when a viewer on `viewerPlan` may play content gated at `required`. */
export function canWatch(viewerPlan: PlanId, required: PlanId): boolean {
  return RANK[viewerPlan] >= RANK[required];
}

export function formatPrice(cents: number, currency = "USD"): string {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
