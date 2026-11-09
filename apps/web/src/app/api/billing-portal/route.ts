import { NextResponse } from "next/server";
import { billingEnabled, siteUrl } from "@/lib/env";
import { getViewer } from "@/lib/viewer";
import { getOrCreateCustomer } from "@/lib/billing";
import { stripe } from "@/lib/stripe";

/** Open the Stripe customer portal (change plan, update card, cancel). */
export async function POST() {
  if (!billingEnabled) return NextResponse.redirect(new URL("/plans", siteUrl), 303);
  const viewer = await getViewer();
  if (!viewer) return NextResponse.redirect(new URL("/login?next=/account", siteUrl), 303);
  const customer = await getOrCreateCustomer(viewer.id, viewer.email);
  const portal = await stripe().billingPortal.sessions.create({ customer, return_url: `${siteUrl}/account` });
  return NextResponse.redirect(portal.url, 303);
}
