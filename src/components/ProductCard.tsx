"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

export function ProductCard({ product, sig }: { product: Product; sig?: string }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.handle);
  const colors = product.options.find((o) => o.name === "Color")?.values ?? [];
  const p = product.price;
  const c = product.compareAtPrice;

  return (
    <article className="pcard" style={{ "--fa": product.card.a } as CSSProperties}>
      <div className="pcard__frame">
        <button
          className="pcard__wish"
          aria-pressed={saved}
          aria-label={saved ? `Quitar ${product.title} de guardados` : `Guardar ${product.title}`}
          onClick={() => toggle(product.handle)}
        >
          {saved ? "♥" : "+"}
        </button>
      </div>
      <div className="pcard__meta">
        <div className="pcard__top">
          <span>{product.code}</span>
          {sig ? <span className="pcard__sig">{sig}</span> : null}
        </div>
        <div className="pcard__line">
          <h3 className="pcard__name">
            <Link className="pcard__link" href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          </h3>
          <span className="pcard__price">
            {c ? (
              <>
                <s>{formatMoney(c.amount, c.currencyCode)}</s>
                {formatMoney(p.amount, p.currencyCode)}
                <span className="off">−{Math.round((1 - p.amount / c.amount) * 100)}%</span>
              </>
            ) : (
              formatMoney(p.amount, p.currencyCode)
            )}
          </span>
        </div>
        <div className="pcard__colors">
          {colors.slice(0, 4).map((_, i) => (
            <i key={i} style={{ background: product.images[i]?.tone ?? "#ccc" }} />
          ))}
          {colors.length > 4 ? <span className="more">+{colors.length - 4}</span> : null}
        </div>
      </div>
    </article>
  );
}
