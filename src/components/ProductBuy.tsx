"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const saved = has(product.handle);

  // Reserve space for the sticky mobile bar so the footer stays reachable.
  useEffect(() => {
    document.body.classList.add("has-buybar");
    return () => document.body.classList.remove("has-buybar");
  }, []);
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const variantFor = (cl: string, sz: string) => product.variants.find((v) => v.title === `${cl} / ${sz}`);
  const selected = size ? variantFor(color, size) : undefined;
  const toneForColor = (cl: string) => {
    const idx = colors.indexOf(cl);
    return product.images[idx]?.tone ?? "#ccc";
  };
  const price = selected?.price ?? product.price;
  const compareAt = selected?.compareAtPrice ?? product.compareAtPrice;

  function addToCart(): boolean {
    if (!size || !selected) {
      setErr("Elige una talla");
      return false;
    }
    if (!selected.available) {
      setErr("Esa talla está agotada");
      return false;
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
    return true;
  }
  function mobileAdd() {
    if (size && selected && selected.available) addToCart();
    else setSheetOpen(true);
  }
  function sheetAdd() {
    if (addToCart()) setSheetOpen(false);
  }

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

      <dl className="pdp-trust">
        <div>
          <dt>Envío</dt>
          <dd>
            <span className="ph">48–72 h</span> · con seguimiento
          </dd>
        </div>
        <div>
          <dt>Devoluciones</dt>
          <dd>
            <span className="ph">30 días</span> · sin coste
          </dd>
        </div>
        <div>
          <dt>Pago</dt>
          <dd>Cifrado y seguro</dd>
        </div>
      </dl>

      {/* Mobile sticky add-to-cart bar */}
      <div className="buybar">
        <span className="buybar__price">
          {compareAt ? <s>{formatMoney(compareAt.amount, compareAt.currencyCode)}</s> : null}
          <span>{formatMoney(price.amount, price.currencyCode)}</span>
        </span>
        <button className="btn" onClick={mobileAdd}>
          <span>{size ? "Añadir a la bolsa" : "Elegir talla"}</span>
        </button>
      </div>

      {/* Mobile size / quantity sheet */}
      <div className="sheet-scrim" data-open={sheetOpen} onClick={() => setSheetOpen(false)} aria-hidden={!sheetOpen} />
      <div className="sheet" data-open={sheetOpen} role="dialog" aria-modal={sheetOpen} aria-label="Elegir talla">
        <div className="sheet__grab" aria-hidden="true" />
        <div className="sheet__head">
          <h3>Elige tu talla</h3>
          <button className="iconbtn" onClick={() => setSheetOpen(false)} aria-label="Cerrar">
            Cerrar
          </button>
        </div>
        <div className="sheet__body">
          <div className="opt-group">
            <h4>Color — {color}</h4>
            <div className="opt-row">
              {colors.map((cl) => (
                <button
                  key={cl}
                  className="opt"
                  data-active={cl === color}
                  onClick={() => {
                    setColor(cl);
                    setSize(null);
                  }}
                  style={{ gap: 8 }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "9999px",
                      background: toneForColor(cl),
                      display: "inline-block",
                      border: "1px solid rgba(0,0,0,.15)",
                    }}
                  />
                  {cl}
                </button>
              ))}
            </div>
          </div>
          <div className="opt-group">
            <h4>Talla</h4>
            <div className="opt-row">
              {sizes.map((sz) => {
                const v = variantFor(color, sz);
                const disabled = !v || !v.available;
                return (
                  <button
                    key={sz}
                    className="opt"
                    data-active={size === sz}
                    aria-disabled={disabled}
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
          </div>
          <div className="opt-group">
            <h4>Cantidad</h4>
            <div className="qty" role="group" aria-label="Cantidad">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar uno">
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Sumar uno">
                +
              </button>
            </div>
          </div>
          {err ? (
            <p className="mono" role="status" style={{ color: "var(--sale)", fontSize: ".72rem" }}>
              {err}
            </p>
          ) : null}
        </div>
        <div className="sheet__foot">
          <button className="btn btn--block" onClick={sheetAdd}>
            <span>Añadir a la bolsa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
