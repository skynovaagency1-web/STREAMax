"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "@/app/login/actions";

export function AuthForm({ next, initialMode }: { next: string; initialMode: "signin" | "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "signin" ? signIn : signUp, {});
  const field = "mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none focus:border-violet";

  return (
    <>
      <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-1 text-sm text-mist">
        {mode === "signin" ? "Sign in to keep watching." : "Start free. Upgrade any time."}
      </p>
      <form action={action} className="mt-6 space-y-4 text-sm">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="block">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={field}
          />
        </label>
        {state.error && <p className="rounded-xl bg-red-500/10 px-3 py-2 text-red-300">{state.error}</p>}
        {state.message && <p className="rounded-xl bg-emerald-400/10 px-3 py-2 text-emerald-200">{state.message}</p>}
        <button disabled={pending} className="brand-gradient w-full rounded-2xl px-5 py-3 font-semibold text-ink-950 disabled:opacity-50">
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-mist">
        {mode === "signin" ? "New to Streamax?" : "Already have an account?"}{" "}
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-violet-soft hover:text-white">
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </>
  );
}
