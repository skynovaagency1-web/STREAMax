import { NextResponse, type NextRequest } from "next/server";
import { billingEnabled, siteUrl } from "@/lib/env";
import { getViewer } from "@/lib/viewer";
import { getOrCreateCustomer } from "@/lib/billing";
import { priceIdFor, stripe, type Interval } from "@/lib/stripe";

/** Start a Stripe Checkout subscription for Standard or Premium. */
export async function POST(request: NextRequest) {
  if (!billingEnabled) return NextResponse.redirect(new URL("/plans", siteUrl), 303);

  const form = await request.formData();
  const plan = form.get("plan");
  const interval: Interval = form.get("interval") === "yearly" ? "yearly" : "monthly";
  if (plan !== "standard" && plan !== "premium") {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const viewer = await getViewer();
  if (!viewer) return NextResponse.redirect(new URL("/login?mode=signup&next=/plans", siteUrl), 303);

  const customer = await getOrCreateCustomer(viewer.id, viewer.email);

  // Already subscribed: change plan in the billing portal instead of creating a second subscription.
  if (viewer.plan !== "free") {
    const portal = await stripe().billingPortal.sessions.create({ customer, return_url: `${siteUrl}/account` });
    return NextResponse.redirect(portal.url, 303);
  }

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: viewer.id,
    line_items: [{ price: priceIdFor(plan, interval), quantity: 1 }],
    subscription_data: { metadata: { userId: viewer.id } },
    allow_promotion_codes: true,
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/plans`,
  });
  return NextResponse.redirect(session.url!, 303);
}
