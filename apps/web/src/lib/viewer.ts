import "server-only";
import type { PlanId } from "@streamax/core";
import { authEnabled } from "./env";
import { createSupabaseServer } from "./supabase/server";

export interface Viewer {
  id: string;
  email: string | null;
  plan: PlanId;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  hasBilling: boolean;
}

/** The signed-in viewer and their plan, or null when signed out or in demo mode. */
export async function getViewer(): Promise<Viewer | null> {
  if (!authEnabled) return null;
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, current_period_end, stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    plan: (profile?.plan as PlanId | undefined) ?? "free",
    subscriptionStatus: profile?.subscription_status ?? null,
    currentPeriodEnd: profile?.current_period_end ?? null,
    hasBilling: Boolean(profile?.stripe_customer_id),
  };
}
