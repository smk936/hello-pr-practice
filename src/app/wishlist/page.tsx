import type { Metadata } from "next";
import { getCommerce } from "@/lib/commerce/provider";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = {
  title: "Guardados",
  description: "Las prendas que has guardado.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false },
};

export default async function WishlistPage() {
  const products = await getCommerce().getAllProducts();
  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Guardados</span>
        <h1 className="h-display">Lo que has guardado.</h1>
      </header>
      <WishlistView products={products} />
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
