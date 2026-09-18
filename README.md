# CENIT — storefront

A functional premium-fashion storefront built with **Next.js 14 (App Router) + TypeScript**.
Browse, filter, search, add to cart (persistent), wishlist, guest checkout, dev accounts and
order history all work today. External services (Shopify, Stripe, real auth, email) plug in
through clearly-separated adapters and environment variables — no secrets in the repo, no
fabricated data.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # optional — the app runs fully with zero config
pnpm dev                     # http://localhost:3000
```

Scripts: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm typecheck`.

## Architecture

```
src/
  app/                      routes (App Router). Clean URLs, per-route metadata.
    api/checkout            server-validated order + Stripe seam
    api/contact             contact form handler
    sitemap.ts / robots.ts  SEO
  components/               Header, Footer, CartDrawer, ProductCard, ProductBuy, forms…
  lib/
    commerce/               provider seam (see below) + seed catalog + domain types
    cart/  wishlist/  auth/  orders/   client state (Context + localStorage)
    format.ts  validation.ts
  app/globals.css           CENIT design tokens + component styles
```

### The commerce seam

Every page reads data through `getCommerce()` (`src/lib/commerce/provider.ts`), which returns a
`CommerceProvider`. Two implementations:

- **local** (default) — the seed catalog in `src/lib/commerce/data/products.ts`. Names/prices/tones
  are placeholders; verifiable facts (composition, care, origin) are `null` and render as marked
  placeholders. Never fabricated.
- **shopify** — `src/lib/commerce/providers/shopify.ts`. The authenticated Storefront GraphQL
  transport is ready; the field mapping is the remaining work and throws a clear error until done.

## Connecting real services

All configuration lives in `.env.local` (see `.env.example`). Nothing is hardcoded.

- **Shopify** — set `COMMERCE_PROVIDER=shopify`, `SHOPIFY_STORE_DOMAIN`,
  `SHOPIFY_STOREFRONT_ACCESS_TOKEN`; finish the queries + `mapProduct()` in `providers/shopify.ts`.
- **Stripe** — set `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`; implement the
  PaymentIntent / Checkout Session in `src/app/api/checkout/route.ts` (marked `501` until wired).
  With no key set, checkout runs in **dev mode**: it records a real order and shows a confirmation
  clearly marked as a test — it never fakes a charge.
- **Auth** — `src/lib/auth/AuthContext.tsx` is a browser-only DEV adapter (not secure). Replace with
  Shopify Customer Accounts or your backend behind `AUTH_PROVIDER`.
- **Email** — set `EMAIL_PROVIDER` and wire the send in `src/app/api/contact/route.ts` (logs
  server-side until then).

## SEO

Per-route `metadata` + Open Graph, JSON-LD on product pages, `sitemap.xml`, `robots.txt`, clean
URLs, `<html lang="es">`, skip link and keyboard-focus styles. Set `NEXT_PUBLIC_SITE_URL` for
canonical/OG URLs in production.

## Status

Placeholders are intentional and marked (dotted underline / “pendiente de dato real”). Swap the
seed provider for Shopify and fill real policy/shipping/returns/size data to go live.
