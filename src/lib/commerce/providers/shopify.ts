import type { CommerceProvider } from "../provider";

// ─────────────────────────────────────────────────────────────
// Shopify Storefront API provider — SCAFFOLD.
// The transport (env + authenticated GraphQL fetch) is real and ready.
// The field mapping (Shopify schema → our domain types) is the remaining
// work; until it is written, every method throws a clear error instead of
// returning fake data. Activate with COMMERCE_PROVIDER=shopify once done.
// See README → "Connecting Shopify".
// ─────────────────────────────────────────────────────────────
const API_VERSION = "2024-10";

export class ShopifyProvider implements CommerceProvider {
  private domain: string;
  private token: string;

  constructor() {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!domain || !token) {
      throw new Error(
        "COMMERCE_PROVIDER=shopify but SHOPIFY_STORE_DOMAIN / " +
          "SHOPIFY_STOREFRONT_ACCESS_TOKEN are not set. Add them to .env.local " +
          "(see .env.example), or set COMMERCE_PROVIDER=local.",
      );
    }
    this.domain = domain;
    this.token = token;
  }

  /** Authenticated Storefront GraphQL call. Ready for the queries below. */
  async storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(`https://${this.domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.token,
      },
      body: JSON.stringify({ query, variables }),
      // Revalidate on the server; tune per route as needed.
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Shopify Storefront HTTP ${res.status}`);
    const json = (await res.json()) as { data?: T; errors?: unknown };
    if (json.errors) throw new Error("Shopify Storefront error: " + JSON.stringify(json.errors));
    return json.data as T;
  }

  private todo(): never {
    throw new Error(
      "ShopifyProvider transport is ready but field mapping is not implemented. " +
        "Write the GraphQL queries + mapProduct() here, then remove these guards. " +
        "Until then, run with COMMERCE_PROVIDER=local.",
    );
  }

  async getAllProducts() {
    return this.todo();
  }
  async getProduct() {
    return this.todo();
  }
  async getCollections() {
    return this.todo();
  }
  async getCollection() {
    return this.todo();
  }
  async getProductsInCollection() {
    return this.todo();
  }
  async searchProducts() {
    return this.todo();
  }
}
