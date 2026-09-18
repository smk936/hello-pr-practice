"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

export function ProductBuy({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const colors = product.options.find((o) => o.name === "Color")?.values ?? [];
  const sizes = product.options.find((o) => o.name === "Talla")?.values ?? [];

  const [color, setColor] = useState(colors[0] ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");

  const variantFor = (cl: string, sz: string) =>
    product.variants.find((v) => v.title === `${cl} / ${sz}`);
  const selected = size ? variantFor(color, size) : undefined;
  const saved = has(product.handle);

  const toneForColor = (cl: string) => {
    const idx = colors.indexOf(cl);
    return product.images[idx]?.tone ?? "#ccc";
  };

  function addToCart() {
    if (!size || !selected) {
      setErr("Elige una talla");
      return;
    }
    if (!selected.available) {
      setErr("Esa talla está agotada");
      return;
    }
    add({
      id: selected.id,
      productHandle: product.handle,
      variantId: selected.id,
      title: product.title,
      variantTitle: selected.title,
      code: product.code,
      tone: toneForColor(color),
      unitPrice: selected.price,
      quantity: qty,
    });
    setErr("");
  }

  const price = selected?.price ?? product.price;
  const compareAt = selected?.compareAtPrice ?? product.compareAtPrice;

  return (
    <div className="buy">
      <div className="buy__eye mono">
        <span>{product.code}</span>
      </div>
      <h1 className="buy__name serif">{product.title}</h1>
      <p className="buy__essence serif">{product.subtitle}</p>

      <div className="price">
        {compareAt ? (
          <>
            <s>{formatMoney(compareAt.amount, compareAt.currencyCode)}</s>
            <span className="now">{formatMoney(price.amount, price.currencyCode)}</span>
            <span className="off mono">−{Math.round((1 - price.amount / compareAt.amount) * 100)}%</span>
          </>
        ) : (
          <span className="now">{formatMoney(price.amount, price.currencyCode)}</span>
        )}
      </div>

      <hr className="hair" />

      <div>
        <div className="grp__lab">
          <span>
            Color — <b>{color}</b>
          </span>
        </div>
        <div className="swatches" role="group" aria-label="Color">
          {colors.map((cl) => (
            <button
              key={cl}
              className={`swatch${cl === color ? " sel" : ""}`}
              style={{ background: toneForColor(cl) }}
              aria-label={cl}
              aria-pressed={cl === color}
              onClick={() => {
                setColor(cl);
                setSize(null);
                setErr("");
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="grp__lab">
          <span>Talla</span>
          <Link className="linkish" href="/size-guide">
            Guía de tallas ↗
          </Link>
        </div>
        <div className="sizes" role="group" aria-label="Talla">
          {sizes.map((sz) => {
            const v = variantFor(color, sz);
            const disabled = !v || !v.available;
            return (
              <button
                key={sz}
                className={`size${size === sz ? " sel" : ""}`}
                aria-disabled={disabled}
                aria-pressed={size === sz}
                onClick={() => {
                  if (disabled) return;
                  setSize(sz);
                  setErr("");
                }}
              >
                {sz}
              </button>
            );
          })}
        </div>
        <div className="hint mono" role="status" aria-live="polite">
          {err}
        </div>
      </div>

      <div className="buyrow">
        <div className="qty" role="group" aria-label="Cantidad">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar uno">
            −
          </button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Sumar uno">
            +
          </button>
        </div>
        <button className="btn" onClick={addToCart}>
          <span>Añadir a la bolsa</span>
        </button>
      </div>

      <div className="wishline mono">
        <button aria-pressed={saved} onClick={() => toggle(product.handle)}>
          {saved ? "♥ Guardado" : "♡ Guardar"}
        </button>
      </div>

      <div className="trust">
        <div>
          <h4>Envío</h4>
          <p>
            <span className="ph">48–72 h</span> · seguido
          </p>
        </div>
        <div>
          <h4>Devoluciones</h4>
          <p>
            <span className="ph">30 días</span> · sin coste
          </p>
        </div>
        <div>
          <h4>Pago</h4>
          <p>Seguro</p>
        </div>
        <div>
          <h4>Atención</h4>
          <p>Personas</p>
        </div>
      </div>
    </div>
  );
}
