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

## Roadmap

- Auth and database (Supabase)
- Checkout and recurring billing (Stripe Billing)
- Creator payouts (Stripe Connect), monthly via `computePayouts`
- Video upload, transcoding and HLS delivery (Mux)
- Real ads via VAST tags (Google IMA SDK) at each break in `adSchedule`
- Mobile and TV apps
