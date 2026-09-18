# CENIT — Shopify Online Store 2.0 theme

An editorial fashion theme built natively for Shopify (Liquid, JSON templates,
sections with `{% schema %}`). No React, no Node runtime, no build step — it
uploads and runs directly on Shopify.

- **Identity:** Fraunces (display) · Schibsted Grotesk (text) · Fragment Mono
  (labels). Fonts are **self-hosted** from `assets/` (no external requests).
- **Palette:** Cal `#ECEAE2`, Tinta `#17120E`, Almagre `#9A3B2B`, Mar `#22484C`.
- **Language:** default locale is Spanish (`locales/es.default.json`).

## Install

1. Zip the **contents** of this folder (the zip root must contain
   `layout/`, `templates/`, `sections/`, … — not a wrapping folder).
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip**.
3. **Customize** to open the Theme Editor. Assign collections to the homepage
   *Featured collection* and *Collection list* sections, choose menus in the
   Header/Footer, and set the logo under **Theme settings → Marca**.

## What's real (native Shopify)

- **Cart** — AJAX via `/cart/add.js`, `/cart/change.js` and the Section
  Rendering API (slide-in drawer or cart page, switchable in settings).
- **Product** — real variants/options/media; variant picker updates price,
  availability, media and the `?variant=` URL; add-to-cart is a genuine
  `{% form 'product' %}`; dynamic checkout buttons supported.
- **Collection** — native storefront **filtering** (`collection.filters`),
  **sorting** (`collection.sort_options`) and pagination.
- **Search** — native results page + **predictive search**
  (`/search/suggest.json`).
- **Customers** — login, register, account, order, addresses, activate and
  reset-password, all on native customer forms.
- **SEO** — native `content_for_header`, canonical URL, Open Graph/Twitter
  tags, and product/article structured data.

## Required metafields (Product)

The product page reads these from **Settings → Custom data → Products**. All are
optional — each accordion shows a friendly placeholder until its metafield is
filled, so nothing is invented.

| Accordion            | Namespace | Key                | Suggested type          |
|----------------------|-----------|--------------------|-------------------------|
| Materiales           | `custom`  | `material`         | Multi-line text / Rich text |
| Corte y talla        | `custom`  | `fit`              | Multi-line text / Rich text |
| Cuidados             | `custom`  | `care`             | Multi-line text / Rich text |
| Envío y devoluciones | `custom`  | `shipping_returns` | Rich text               |

Color swatches use Shopify's native swatch data — set them under
**Settings → Custom data → Variants / option values** (or via a color-named
option) and they appear automatically on cards and the product page.

## External integrations

None are hard-coded. Everything runs through Shopify:

- **Payments / checkout** — Shopify Checkout (configure under Settings →
  Payments). Dynamic buttons appear automatically when enabled.
- **Newsletter** — the footer/newsletter forms create Shopify customers tagged
  `newsletter`. Connect Shopify Email or a marketing app to send to them.
- **Fonts** — self-hosted; no third-party requests.

## Theme settings (overview)

Colours, base type size, page width, section spacing, uppercase buttons,
product-card image ratio / swatches / secondary image, cart type (drawer or
page), logo + width + favicon, and social links — all in **Theme settings**.

## Development

Validated with Shopify **Theme Check** (`@shopify/theme-check`) — 0 offenses.
To re-run locally: `npx @shopify/cli theme check` (or the Node package).
