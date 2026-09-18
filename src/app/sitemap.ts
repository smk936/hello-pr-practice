import type { MetadataRoute } from "next";
import { getCommerce } from "@/lib/commerce/provider";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const commerce = getCommerce();
  const [products, collections] = await Promise.all([
    commerce.getAllProducts(),
    commerce.getCollections(),
  ]);
  const now = new Date();

  const staticPaths = [
    "",
    "/collections",
    "/search",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/size-guide",
    "/privacy",
    "/terms",
    "/wishlist",
    "/login",
    "/register",
  ];

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: now })),
    ...collections.map((c) => ({ url: `${base}/collections/${c.handle}`, lastModified: now })),
    ...products.map((p) => ({ url: `${base}/products/${p.handle}`, lastModified: new Date(p.createdAt) })),
  ];
}
