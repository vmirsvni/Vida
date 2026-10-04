# VIDA BEAUTY — presentation demo

A Persian-only (RTL) luxury website with a working booking flow and admin panel for **Vida Beauty**, a PMU atelier in Sabzevar.
This is a **demo for the salon owner**. All photos, prices, specialists, testimonials, the payment gateway and the SMS messages are placeholders or simulations.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # slot engine, cancellation policy and installment tests
npm run build
```

## Demos

| Route | What |
|---|---|
| `/` | Demo chooser — for each demo «دمو وبسایت N» + «دمو پنل کاربر وبسایت N» |
| `/demo-2/account` | پنل کاربر (customer panel): mock OTP sign-in, my bookings (cancel by policy, reschedule by phone), payments & installments, SMS, profile |
| `/demo-4` … | Demo 4 — after the Dribbble shots "AI Skincare Cosmetologist Landing Page" (QClay), restyled with the taste-skill rules: neutral base taken from the hero video's backdrop, one rosewood accent (#8e4b52), one radius system (28px surfaces · 16px controls · pills), no labels on photos, no three-card rows; single video hero that blends into the page (AI clip supplied by the client, played forward-and-back) with scan boxes tracking the lash line, brow and lips — labelled «خط چشم / ویبروز ابرو / شیدینگ لب» (`src/components/demo4/ScanHero.tsx` + `track.json`), shop (`/demo-4/shop` → product → `/demo-4/cart` → `/demo-4/checkout` → mock gateway `/demo-4/shop/pay` → `/demo-4/shop/success/VO-…`, orders + installments in the user panel; catalogue in `src/components/demo4/products4.ts`), «آکادمی ویدا» page at `/demo-4/academy` (microblading & fibroze courses, international certificate, graduates), Fibroze is not offered as a demo 4 service (`HIDDEN4` in `src/components/demo4/data4.ts`), and its own booking wizard, checkout, receipt and user panel (`src/components/demo4/flow/`) |
| `/demo-3` … | Demo 3 — one-page site after the Dribbble shot "Elegant Beauty Salon Website Concept" (Hanna Yereshchenko), paper & espresso, Reem Kufi + Vazirmatn + upright Bodoni, masthead nav; its own booking, gateway, receipt and user panel (`src/components/demo3/flow/`) |
| `/demo-2` | Demo 2 — one-page site in the style of the Dribbble shot "Beauty Center Landing Page" (Zahra Mohammadi / Pela Design), Persian, Vida data |
| `/demo-2/booking` | Demo 2 booking flow (same engine, rose skin) |

Demo 1 was removed (its old URLs redirect to `/`). Each demo keeps its own data (`vida-demo2-v1` / `vida-demo3-v1` / `vida-demo4-v1` in localStorage). `/account` and every `/admin` URL redirect to the demo 4 user panel.

**Payments:** direct (bank IPG) or installments with **SnappPay / DigiPay** (4 monthly installments, demo terms) — `src/lib/booking/payment.ts`, picker + installment table in `src/components/booking/PaymentUI.tsx`. The gateways are simulated and collect no card or account data. A floating «همه دموها» button in every demo returns to the chooser.

Demo 2 styling lives in `src/app/demo2.css` (`.theme-rose` re-declares the design tokens, so shared booking/admin components re-skin automatically); its sections are in `src/components/demo2/`.

## What works

Every demo has: booking (خدمت → متخصص → زمان → اطلاعات → پرداخت, Jalali calendar showing every day and slot as available / booked / closed, 15-min buffer, no overlaps), a simulated gateway that collects no card data, a confirmation page (booking ID, simulated SMS, .ics) and a user panel (mock OTP sign-in, bookings, installments, SMS, profile).

Data is stored in the browser's `localStorage`, so an online booking appears in the user panel of the same browser (sign in with the phone used for booking).

## Where to replace demo content

| What | File |
|---|---|
| Shared alt/focal fallbacks | `src/data/media.ts` (credits: `docs/CREDITS.md`) |
| Demo 2 images | `src/data/media2.ts`, `public/images/d2d/` |
| Demo 3 images | `src/data/media3.ts`, `public/images/d3c/` (client-chosen Pinterest editorial set, one paper grade) |
| Demo 4 images and scan-box positions | `src/data/media4.ts`, `public/images/d4b/` (scan.mp4 / .webm / .jpg; academy `ac-*`, graduates `grad-*`), academy copy in `src/components/demo4/data4.ts`, tracking in `src/components/demo4/track.json` |
| Prices and durations (`priceIsDemo`) | `src/data/services.ts` |
| Vibroze copy (`copyIsPlaceholder`) | `src/data/services.ts` |
| Specialists, working hours | `src/data/specialists.ts` |
| Phone, address, Instagram, map link | `src/data/site.ts` |
| Courses and certificate issuer (enables «مدرک بین‌المللی») | `src/data/content.ts` → `certificate.issuer` |
| Testimonials (all `isDemo`) and FAQ | `src/data/content.ts` |
| Logo | `public/brand/` (original file kept as `vida-logo-original.jpg`) |

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.** Design tokens live in `src/app/globals.css`.
- **Fonts are self-hosted** (`public/fonts`, `src/app/fonts.css`): Markazi Text for display, Vazirmatn for body, Cormorant Garamond italic for the few Latin accents.
- **Pure booking engine:** `src/lib/booking/slots.ts` (slots, buffer, blocks, merge for «فرقی ندارد») and `policy.ts` (24h / 20% rule, status labels and transitions).
- **Repository layer:** `src/lib/store/store.ts`. Every read and write goes through it, so production can swap `localStorage` for an API without touching the UI.
- **Domain model:** `src/data/types.ts`. It includes fields for a future loyalty program (VIP, birthday, points, referral) and `Product` / `Package` types for a future shop.
- **Production TODO:** real payment gateway (IPG callback + verification), SMS provider, authentication for `/admin`, a database, a real map embed, and the production domain in `site.url`.
