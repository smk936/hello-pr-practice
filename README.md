# CENIT — Storefront de moda

Tienda de moda contemporánea construida con **Next.js 14 (App Router) + TypeScript**.
Diseño editorial propio (no plantilla), catálogo, filtros, búsqueda, carrito persistente,
wishlist, checkout como invitado, cuentas y historial de pedidos. Las integraciones externas
(Shopify, Stripe, email) están **desacopladas tras variables de entorno**: la tienda arranca y
funciona por completo sin configurar nada, en modo local/desarrollo.

> **Estado honesto:** como *storefront* está terminada y verificada (compila, sin errores de
> TypeScript, QA de navegador en verde en 5 breakpoints). Para **operar de verdad** hay que
> conectar servicios externos — ver [Estado de integraciones](#estado-de-integraciones--pendiente-de-configurar).

---

## Tecnologías

| | |
|---|---|
| Framework | Next.js `14.2.35` (App Router, React Server Components) |
| Lenguaje | TypeScript `5.5` (modo `strict`) |
| UI | React `18.3`, CSS propio con design tokens (sin framework de CSS) |
| Estado | React Context + `localStorage` (carrito, wishlist, sesión dev) |
| Fuentes | Google Fonts vía `<link>` (Fraunces, Schibsted Grotesk, Fragment Mono) |
| Base de datos | **Ninguna** (datos semilla + `localStorage`; ver [Base de datos](#base-de-datos)) |
| Gestor de paquetes | **pnpm** (lockfile: `pnpm-lock.yaml`) |

---

## Requisitos

- **Node.js ≥ 18.18** (recomendado 20 LTS).
- **pnpm ≥ 9** (probado con 10.33). — instalar: `npm i -g pnpm` o `corepack enable`.
- No requiere base de datos ni ningún otro servicio para arrancar en local.
- (`npm` o `yarn` también funcionan, pero el lockfile incluido es de pnpm; usar pnpm garantiza versiones idénticas.)

---

## Instalación

```bash
# 1. Instalar dependencias (usa el lockfile, versiones exactas)
pnpm install --frozen-lockfile

# 2. Crear el archivo de entorno local
cp .env.example .env.local
#    (opcional: el proyecto arranca sin tocar nada)

# 3. Arrancar en desarrollo
pnpm dev
#    → http://localhost:3000
```

---

## Variables de entorno

Todas se documentan en **`.env.example`**. Cópialo a `.env.local` y rellena solo lo que necesites.
`.env.local` está en `.gitignore` y **nunca** debe subirse.

| Variable | ¿La lee la app hoy? | Para qué sirve | Dónde obtenerla |
|---|:--:|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL pública absoluta (canonical, Open Graph, `sitemap.xml`) | Tú la defines (local: `http://localhost:3000`) |
| `COMMERCE_PROVIDER` | ✅ | `local` (catálogo semilla) o `shopify` | Tú eliges |
| `SHOPIFY_STORE_DOMAIN` | ✅ (si `=shopify`) | Dominio `xxx.myshopify.com` | Panel de Shopify |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | ✅ (si `=shopify`) | Token de la Storefront API | Shopify → Apps → Develop apps → Storefront API |
| `STRIPE_SECRET_KEY` | ✅ (si se define) | Activa la ruta de pago real (desactiva el modo dev) | dashboard.stripe.com → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⏳ reservada | Necesaria para completar Stripe (cliente) | Igual que arriba |
| `STRIPE_WEBHOOK_SECRET` | ⏳ reservada | Verificar webhooks de Stripe | Stripe → Developers → Webhooks |
| `EMAIL_PROVIDER` | ✅ (si se define) | Activa el envío real en `/api/contact` y `/api/newsletter` | Tu proveedor (Resend, Postmark, Klaviyo…) |
| `EMAIL_API_KEY`, `EMAIL_FROM` | ⏳ reservadas | Credenciales/remitente del email real | Tu proveedor |
| `AUTH_SECRET` | ⏳ reservada | Firmar sesiones cuando migres a auth real | Tú la generas |

✅ = el código la lee ya · ⏳ = necesaria solo cuando conectes esa integración (documentada para que sepas qué añadir).

---

## Desarrollo

```bash
pnpm dev          # servidor de desarrollo con recarga en caliente → localhost:3000
pnpm typecheck    # comprobación de TypeScript (tsc --noEmit)
```

## Build (producción)

```bash
pnpm build        # compila y prerenderiza (SSG/SSR)
```

## Producción (ejecutar)

```bash
pnpm build && pnpm start     # sirve la build en http://localhost:3000
# Puerto configurable: PORT=8080 pnpm start
```

---

## Base de datos

**El proyecto no usa base de datos.** No hay migraciones ni seeds que ejecutar.

- **Catálogo:** datos semilla en `src/lib/commerce/data/products.ts` (marcados como placeholder;
  los datos verificables —composición, cuidados…— se dejan vacíos a propósito).
- **Carrito, wishlist, sesión y pedidos de prueba:** viven en el `localStorage` del navegador
  (adaptadores de desarrollo en `src/lib/cart`, `src/lib/wishlist`, `src/lib/auth`, `src/lib/orders`).

Cuando conectes Shopify, el catálogo y los pedidos pasan a su backend (no necesitas BD propia).
Si prefieres tu propio backend, sustituye esos adaptadores por tu base de datos.

---

## Pagos

La lógica vive en **`src/app/api/checkout/route.ts`**, detrás de un adaptador:

- **Sin `STRIPE_SECRET_KEY`** → modo desarrollo: valida el pedido en servidor, calcula el total y
  crea un **pedido de prueba** (`TEST-…`) con confirmación claramente marcada. **No cobra nada.**
- **Con `STRIPE_SECRET_KEY`** → la ruta deja de estar en modo dev. La creación del `PaymentIntent`
  / Checkout Session está marcada como **TODO** (devuelve `501`) hasta que la implementes ahí.

**Para activarlo:** define `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
(dashboard.stripe.com → Developers → API keys), implementa el PaymentIntent en esa ruta, y añade
Stripe Elements/Checkout en el cliente. Impuestos y gastos de envío: con Stripe Tax o Shopify.

---

## Productos

- **Modo local (por defecto):** se editan en `src/lib/commerce/data/products.ts`.
- **Modo Shopify:** pon `COMMERCE_PROVIDER=shopify` + los dos `SHOPIFY_*`, y completa el mapeo de
  campos en `src/lib/commerce/providers/shopify.ts` (el transporte GraphQL ya está listo; el mapeo
  a nuestros tipos es el único TODO). A partir de ahí, los productos se gestionan en el panel de Shopify.

Toda la app lee a través de `getCommerce()` (`src/lib/commerce/provider.ts`), así que cambiar de
fuente no toca las páginas.

---

## Imágenes

Hoy el catálogo usa **placeholders tonales art-dirigidos** (campos de color + grano), sin assets
externos, por lo que el repo es ligero y funciona offline. Para imágenes reales:

- **Vía Shopify:** las URLs llegan de `cdn.shopify.com` (ya permitido en `next.config.mjs` →
  `images.remotePatterns`). Renderiza con `next/image` para optimización automática.
- **Self-host:** crea una carpeta `public/` y referencia `/tu-imagen.jpg`, o añade tu CDN a
  `images.remotePatterns`. El modelo de datos (`ProductImage.url` en `src/lib/commerce/types.ts`)
  ya contempla una `url` real por imagen.

---

## Deployment

**Opción A — Vercel (recomendada, cero configuración para Next):**
1. Importa el repositorio en Vercel.
2. Añade las variables de entorno (mínimo `NEXT_PUBLIC_SITE_URL` con tu dominio real).
3. Deploy. Vercel detecta Next.js y usa `build`/`start` automáticamente.

**Opción B — cualquier host con Node (≥18.18):**
```bash
pnpm install --frozen-lockfile
pnpm build
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com pnpm start
```
Sirve detrás de un reverse proxy (Nginx/Caddy) apuntando al puerto de la app.

Tras desplegar, `/(sitemap.xml)` y `/(robots.txt)` se generan solos a partir de `NEXT_PUBLIC_SITE_URL`.

---

## Estado de integraciones — PENDIENTE DE CONFIGURAR

Nada de esto se hace pasar por funcional. Están **arquitecturadas** (adaptador + variables) pero
requieren que conectes el servicio real:

- **Pagos (Stripe):** implementar el PaymentIntent en `src/app/api/checkout/route.ts`. Hoy: modo prueba.
- **Impuestos y gastos de envío:** no se calculan (checkout indica "se calcula en el pago"). Con Stripe Tax / Shopify.
- **Códigos de descuento:** la rebaja por `compare-at` funciona; falta el campo de código promocional.
- **Email (contacto/newsletter/confirmación):** validan y registran en servidor, **no envían** correo hasta configurar `EMAIL_PROVIDER`.
- **Inventario:** las tallas agotadas se deshabilitan, pero el stock no se descuenta (no hay backend de inventario).
- **Cuentas de cliente:** auth de **desarrollo** en `localStorage` (no segura). Migrar a Shopify Customer Accounts o backend propio.
- **Catálogo real:** completar `providers/shopify.ts` o sustituir el seed por tu fuente.
- **Analytics / CMS / fulfillment:** no incluidos.

## Funcionalidades terminadas (verificadas por QA)

Home editorial · colecciones · categorías con **filtros + orden** (URL limpia) · **búsqueda** ·
**ficha de producto** (galería, variantes color/talla, cantidades) · **carrito** persistente + drawer ·
**wishlist** · **checkout** (validación, estados, confirmación de pedido en modo prueba) · **cuenta**
(registro/login/pedidos, dev) · páginas de ayuda/legales · **SEO** (metadata, Open Graph, JSON-LD de
producto, `sitemap.xml`, `robots.txt`, canonical) · accesibilidad (labels, foco de teclado, `lang`) ·
**responsive** verificado en 1440/1280/tablet/390/375 sin overflow · sin errores de consola/hydration.

---

## Estructura del proyecto

```
CENIT-storefront/
├── src/
│   ├── app/                      # Rutas (App Router) — cada carpeta es una URL
│   │   ├── layout.tsx  page.tsx  globals.css  icon.svg
│   │   ├── collections/  products/  search/  cart/  checkout/  account/
│   │   ├── login/  register/  wishlist/  about/  contact/  faq/ …
│   │   ├── api/                  # checkout · contact · newsletter (route handlers)
│   │   ├── sitemap.ts  robots.ts
│   │   └── (loading.tsx skeletons, not-found.tsx)
│   ├── components/               # Header, Footer, CartDrawer, ProductCard, ProductBuy, …
│   └── lib/                      # commerce (provider + seed), cart, wishlist, auth, orders, format, validation
├── public/                       # (opcional) assets estáticos propios
├── package.json  pnpm-lock.yaml
├── tsconfig.json  next.config.mjs
├── .env.example  .gitignore  README.md
```

---

## Troubleshooting

| Síntoma | Causa / solución |
|---|---|
| `pnpm: command not found` | `npm i -g pnpm` o `corepack enable`. |
| La instalación falla / versiones raras | Usa `pnpm install --frozen-lockfile` con Node ≥ 18.18. |
| Puerto 3000 ocupado | `PORT=3001 pnpm dev` (o `pnpm start`). |
| Las fuentes no se ven (serif genérica) | El navegador no llega a `fonts.googleapis.com`; hay stack de reserva. Revisa la red de salida. |
| Error "ShopifyProvider … not configured" | Pusiste `COMMERCE_PROVIDER=shopify` sin tokens. Añádelos o vuelve a `local`. |
| El checkout devuelve `501` | Definiste `STRIPE_SECRET_KEY` pero falta implementar el PaymentIntent. Impleméntalo o quita la variable para el modo prueba. |
| El carrito "se vacía" entre dispositivos | Es esperado: el carrito dev vive en `localStorage` del navegador. |
| `next build` falla por tipos | `pnpm typecheck` para ver el detalle; el árbol entregado compila limpio. |

---

_Construido como storefront listo para producción a falta de conectar las integraciones externas descritas arriba._
