"use server";

import { redirect } from "next/navigation";
import { authEnabled, siteUrl } from "@/lib/env";
import { createSupabaseServer } from "@/lib/supabase/server";

function safeNext(next: FormDataEntryValue | null): string {
  const v = typeof next === "string" ? next : "/";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

export interface AuthState {
  error?: string;
  message?: string;
}

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  if (!authEnabled) return { error: "Accounts aren't switched on yet." };
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) return { error: error.message };
  redirect(safeNext(form.get("next")));
}

export async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  if (!authEnabled) return { error: "Accounts aren't switched on yet." };
  const supabase = await createSupabaseServer();
  const next = safeNext(form.get("next"));
  const { data, error } = await supabase.auth.signUp({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) return { error: error.message };
  if (data.session) redirect(next);
  return { message: "Check your email to confirm your account, then come back to sign in." };
}

export async function signOut() {
  if (authEnabled) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }
  redirect("/");
}
