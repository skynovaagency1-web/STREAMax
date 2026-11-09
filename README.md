# Streamax

Movies and series, anytime, anywhere. Original streaming platform with three revenue streams:

1. **Subscriptions**: Standard and Premium plans (no ads, higher quality, more screens).
2. **Free tier with ads**: pre-roll and mid-roll breaks that upsell to paid plans.
3. **Creator uploads**: creators keep **70%** of the revenue their titles earn, and Streamax keeps 30%.

## Structure

```
apps/web        Next.js website (App Router, TypeScript, Tailwind)
packages/core   Shared types, demo catalogue, plans, ad schedule, revenue-share logic
```

Planned: `apps/mobile` (Expo, iOS/Android) and `apps/tv` (Android TV / Fire TV, then Tizen/webOS), both reusing `@streamax/core`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # revenue split, ad schedule, plan gating
npm run build
```

The MVP runs on demo data. Use the **Plans** page to switch between Free / Standard / Premium and preview ads and paywalls.

## Deploy (Cloudflare Workers)

The web app runs on Cloudflare Workers through the OpenNext adapter.

```bash
cd apps/web
npx wrangler login     # once
npm run preview        # build and run the Worker locally
npm run deploy         # build and deploy to <name>.workers.dev
```

Or connect the repo in **Cloudflare dashboard → Workers & Pages → Create → Import a repository**:
root directory `apps/web`, build command `npx opennextjs-cloudflare build`, deploy command `npx opennextjs-cloudflare deploy`.
Add the variables from `apps/web/.env.example` as **build variables** (the `NEXT_PUBLIC_*` ones are baked in at build time)
and as **secrets** on the Worker (the rest).

## Accounts and payments

Without keys, the site runs in **demo mode** (plan switcher, no sign-in). To switch on real accounts and billing:

1. **Supabase**: create a project, run `supabase/migrations/0001_profiles.sql` in the SQL editor, and copy the URL, anon key and service-role key.
   Under Authentication → URL configuration, set the site URL and add `<site>/auth/callback` as a redirect URL.
2. **Stripe**: create products *Standard* and *Premium*, each with a monthly and a yearly recurring price, and copy the four price ids.
   Turn on the customer portal (Settings → Billing → Customer portal).
3. **Stripe webhook**: add an endpoint at `<site>/api/stripe/webhook` for `checkout.session.completed` and
   `customer.subscription.created|updated|deleted`, and copy its signing secret.
4. Put everything in `apps/web/.env.local` (local) or the Cloudflare variables (production).

A viewer's plan is only ever changed by the Stripe webhook, never by the browser.

## Roadmap

- ~~Auth and database (Supabase)~~
- ~~Checkout and recurring billing (Stripe Billing)~~
- Creator payouts (Stripe Connect), monthly via `computePayouts`
- Video upload, transcoding and HLS delivery (Mux)
- Real ads via VAST tags (Google IMA SDK) at each break in `adSchedule`
- Mobile and TV apps
