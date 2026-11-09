import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authEnabled } from "@/lib/env";
import { getViewer } from "@/lib/viewer";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string }> }) {
  const { next = "/", mode } = await searchParams;
  if (await getViewer()) redirect(next);

  return (
    <div className="mx-auto max-w-md px-4 pt-16">
      <div className="rounded-3xl border border-white/10 bg-ink-900 p-8">
        {authEnabled ? (
          <AuthForm next={next} initialMode={mode === "signup" ? "signup" : "signin"} />
        ) : (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">Accounts are coming soon</h1>
            <p className="mt-2 text-mist">
              This preview runs in demo mode. Use the Plans page to try Free, Standard and Premium without an account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
