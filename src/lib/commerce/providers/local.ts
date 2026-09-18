import type { CommerceProvider } from "../provider";
import type { Product, ProductFilters, SortKey } from "../types";
import { COLLECTIONS, PRODUCTS } from "../data/products";

function sortProducts(list: Product[], sort: SortKey = "featured"): Product[] {
  const a = [...list];
  switch (sort) {
    case "price-asc":
      return a.sort((x, y) => x.price.amount - y.price.amount);
    case "price-desc":
      return a.sort((x, y) => y.price.amount - x.price.amount);
    case "newest":
      return a.sort((x, y) => +new Date(y.createdAt) - +new Date(x.createdAt));
    default:
      return a;
  }
}

function matchesFilters(p: Product, f?: ProductFilters): boolean {
  if (!f) return true;
  if (f.onSale && !p.compareAtPrice) return false;
  if (f.maxPrice != null && p.price.amount > f.maxPrice) return false;
  if (f.colors?.length) {
    const colors = p.options.find((o) => o.name === "Color")?.values ?? [];
    if (!f.colors.some((c) => colors.includes(c))) return false;
  }
  if (f.sizes?.length) {
    const sizes = p.options.find((o) => o.name === "Talla")?.values ?? [];
    if (!f.sizes.some((s) => sizes.includes(s))) return false;
  }
  return true;
}

export class LocalProvider implements CommerceProvider {
  async getAllProducts(): Promise<Product[]> {
    return PRODUCTS;
  }

  async getProduct(handle: string): Promise<Product | null> {
    return PRODUCTS.find((p) => p.handle === handle) ?? null;
  }

  async getCollections() {
    return COLLECTIONS;
  }

  async getCollection(handle: string) {
    return COLLECTIONS.find((c) => c.handle === handle) ?? null;
  }

  async getProductsInCollection(
    handle: string,
    opts?: { sort?: SortKey; filters?: ProductFilters },
  ): Promise<Product[]> {
    let list: Product[];
    if (handle === "novedades") {
      list = [...PRODUCTS].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (handle === "rebajas") {
      list = PRODUCTS.filter((p) => p.compareAtPrice);
    } else {
      list = PRODUCTS.filter((p) => p.collectionHandles.includes(handle));
    }
    list = list.filter((p) => matchesFilters(p, opts?.filters));
    return sortProducts(list, opts?.sort);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) =>
      [p.title, p.subtitle, p.code, ...p.tags, ...p.collectionHandles, ...p.options.flatMap((o) => o.values)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
}
