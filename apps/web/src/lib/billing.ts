import "server-only";
import type Stripe from "stripe";
import { createSupabaseAdmin } from "./supabase/server";
import { ACTIVE_STATUSES, planForPrice, stripe } from "./stripe";

/** Return the viewer's Stripe customer id, creating the customer on first checkout. */
export async function getOrCreateCustomer(userId: string, email: string | null): Promise<string> {
  const admin = createSupabaseAdmin();
  const { data } = await admin.from("profiles").select("stripe_customer_id").eq("id", userId).single();
  if (data?.stripe_customer_id) return data.stripe_customer_id;

  const customer = await stripe().customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });
  await admin.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", userId);
  return customer.id;
}

/** Copy a subscription's state onto the viewer's profile. The webhook is the only writer of `plan`. */
export async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const admin = createSupabaseAdmin();
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const item = sub.items.data[0];
  const paidPlan = planForPrice(item?.price.id);
  const active = ACTIVE_STATUSES.has(sub.status);

  const update = {
    plan: active && paidPlan ? paidPlan : "free",
    stripe_subscription_id: sub.status === "canceled" ? null : sub.id,
    subscription_status: sub.status,
    current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const userId = sub.metadata?.userId;
  const query = admin.from("profiles").update(update);
  const { error } = userId
    ? await query.eq("id", userId)
    : await query.eq("stripe_customer_id", customerId);
  if (error) throw new Error(`Failed to sync subscription ${sub.id}: ${error.message}`);
}
