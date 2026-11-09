export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when Supabase keys are set. Otherwise the app runs in demo mode. */
export const authEnabled = Boolean(supabaseUrl && supabaseAnonKey);

/** True when accounts and Stripe are both configured, so real checkout is possible. */
export const billingEnabled = authEnabled && Boolean(process.env.STRIPE_SECRET_KEY);
