import type { Collection, Product, ProductFilters, SortKey } from "./types";
import { LocalProvider } from "./providers/local";
import { ShopifyProvider } from "./providers/shopify";

/** The single seam every page reads through. Swap the impl via env. */
export interface CommerceProvider {
  getAllProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
  getProductsInCollection(
    handle: string,
    opts?: { sort?: SortKey; filters?: ProductFilters },
  ): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
}

let cached: CommerceProvider | null = null;

export function getCommerce(): CommerceProvider {
  if (cached) return cached;
  const which = (process.env.COMMERCE_PROVIDER ?? "local").toLowerCase();
  cached = which === "shopify" ? new ShopifyProvider() : new LocalProvider();
  return cached;
}
