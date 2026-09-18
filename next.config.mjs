/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Real product images plug in here later (Shopify CDN, etc.).
  // Until then the catalog renders art-directed tonal placeholders (no external fetch).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
