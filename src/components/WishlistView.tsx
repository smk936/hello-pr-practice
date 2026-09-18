"use client";

import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { ProductCard } from "@/components/ProductCard";

export function WishlistView({ products }: { products: Product[] }) {
  const { handles, ready } = useWishlist();

  if (!ready) return <p className="form-note">Cargando tus guardados…</p>;

  const saved = products.filter((p) => handles.includes(p.handle));
  if (saved.length === 0) {
    return (
      <div className="empty">
        <p>Aún no has guardado nada. El corazón está en cada ficha y en cada card.</p>
        <Link className="btn btn--ghost" href="/collections">
          <span>Ver colecciones</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pgrid">
      {saved.map((p) => (
        <ProductCard key={p.handle} product={p} />
      ))}
    </div>
  );
}
