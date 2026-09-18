// Commerce domain types. Provider-agnostic: the local seed provider and a
// future Shopify provider both produce these shapes.

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface VariantOption {
  name: string; // "Color" | "Talla"
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string; // "Piedra / M"
  options: VariantOption[];
  price: Money;
  compareAtPrice: Money | null;
  available: boolean;
  /** Real stock count, or null when unknown/untracked. Never fabricated. */
  inventory: number | null;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductImage {
  /** Placeholder art-direction tone until real imagery is connected. */
  tone: string;
  alt: string;
  /** Real image URL when available (Shopify CDN, etc.). */
  url?: string;
}

/**
 * Reference facts. `null` means "not yet supplied" — the UI renders a clearly
 * marked placeholder. We never invent composition, care, origin, etc.
 */
export interface ProductDetails {
  composition: string | null;
  care: string | null;
  origin: string | null;
  fit: string | null;
  modelNote: string | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  code: string; // archive code, e.g. "Nº 014"
  subtitle: string; // one-line essence
  description: string[]; // honest, form/use-based paragraphs (no invented facts)
  options: ProductOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  /** Two tones used by the product card's hover crossfade. */
  card: { a: string; b: string };
  price: Money;
  compareAtPrice: Money | null;
  tags: string[];
  collectionHandles: string[];
  details: ProductDetails;
  seo: { title: string; description: string };
  createdAt: string; // ISO
}

export interface Collection {
  handle: string;
  title: string;
  intro: string;
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export interface ProductFilters {
  colors?: string[];
  sizes?: string[];
  maxPrice?: number;
  onSale?: boolean;
}

// ── Cart (client-side domain) ────────────────────────────────
export interface CartLine {
  /** Deterministic id = variantId, so the same variant merges. */
  id: string;
  productHandle: string;
  variantId: string;
  title: string;
  variantTitle: string;
  code: string;
  tone: string;
  unitPrice: Money;
  quantity: number;
}

export interface Cart {
  lines: CartLine[];
  subtotal: Money;
  totalQuantity: number;
}
