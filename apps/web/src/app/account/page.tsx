import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPlan } from "@streamax/core";
import { authEnabled, billingEnabled } from "@/lib/env";
import { getViewer } from "@/lib/viewer";
import { signOut } from "../login/actions";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  if (!authEnabled) redirect("/plans");
  const viewer = await getViewer();
  if (!viewer) redirect("/login?next=/account");
  const plan = getPlan(viewer.plan);
  const { checkout } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pt-12">
      <h1 className="font-display text-3xl font-bold">Your account</h1>
      {checkout === "success" && (
        <p className="rounded-2xl bg-emerald-400/10 px-4 py-3 text-emerald-200">
          Payment received. Your plan updates within a few seconds; refresh if it still shows Free.
        </p>
      )}
      <section className="rounded-3xl border border-white/10 bg-ink-900 p-6">
        <p className="text-sm text-mist">Signed in as</p>
        <p className="font-semibold">{viewer.email}</p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-mist">Plan</p>
            <p className="font-display text-2xl font-bold text-brand">{plan.name}</p>
            <p className="text-sm text-mist">
              {plan.ads ? "With ads" : "No ads"} · {plan.maxQuality} · {plan.screens} screen{plan.screens > 1 ? "s" : ""}
              {viewer.currentPeriodEnd && viewer.plan !== "free" &&
                ` · renews ${new Date(viewer.currentPeriodEnd).toLocaleDateString("en-US", { dateStyle: "medium" })}`}
            </p>
          </div>
          {viewer.plan === "free" ? (
            <Link href="/plans" className="brand-gradient rounded-2xl px-5 py-2.5 font-semibold text-ink-950">
              Upgrade
            </Link>
          ) : (
            billingEnabled && (
              <form action="/api/billing-portal" method="post">
                <button className="rounded-2xl bg-white px-5 py-2.5 font-semibold text-ink-950">Manage billing</button>
              </form>
            )
          )}
        </div>
      </section>
      <form action={signOut}>
        <button className="text-sm text-mist hover:text-white">Sign out</button>
      </form>
    </div>
  );
}
