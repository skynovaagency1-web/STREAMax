import "server-only";
import Stripe from "stripe";
import type { PlanId } from "@streamax/core";

export type Interval = "monthly" | "yearly";
type PaidPlan = Exclude<PlanId, "free">;

let client: Stripe | undefined;
export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // Fetch-based client so it runs on Cloudflare Workers as well as Node.
  return (client ??= new Stripe(key, { httpClient: Stripe.createFetchHttpClient() }));
}

const PRICE_ENV: Record<PaidPlan, Record<Interval, string>> = {
  standard: { monthly: "STRIPE_PRICE_STANDARD_MONTHLY", yearly: "STRIPE_PRICE_STANDARD_YEARLY" },
  premium: { monthly: "STRIPE_PRICE_PREMIUM_MONTHLY", yearly: "STRIPE_PRICE_PREMIUM_YEARLY" },
};

export function priceIdFor(plan: PaidPlan, interval: Interval): string {
  const id = process.env[PRICE_ENV[plan][interval]];
  if (!id) throw new Error(`${PRICE_ENV[plan][interval]} is not set`);
  return id;
}

/** Map a Stripe price id back to a Streamax plan. */
export function planForPrice(priceId: string | undefined): PaidPlan | null {
  if (!priceId) return null;
  for (const plan of Object.keys(PRICE_ENV) as PaidPlan[]) {
    for (const envName of Object.values(PRICE_ENV[plan])) {
      if (process.env[envName] === priceId) return plan;
    }
  }
  return null;
}

/** Subscription statuses that keep paid access. */
export const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);
