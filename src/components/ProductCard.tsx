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

  const frameStyle = { "--fa": product.card.a, "--fb": product.card.b } as CSSProperties;

  return (
    <article className="pcard" style={frameStyle}>
      <div className="pcard__frame">
        <div className="pcard__img pcard__img--a">
          <i className="sh" style={{ inset: "0 44% 30% 0", transform: "skewX(-9deg)" }} />
        </div>
        <div className="pcard__img pcard__img--b">
          <i className="sh" style={{ inset: "22% 0 0 46%", transform: "skewX(-9deg)" }} />
        </div>
        <span className="pcard__fig">receta B</span>
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
