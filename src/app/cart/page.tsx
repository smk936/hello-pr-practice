"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const { cart, setQuantity, remove } = useCart();
  const total = formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode);

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Bolsa</span>
        <h1 className="h-display">Tu bolsa</h1>
      </header>

      {cart.lines.length === 0 ? (
        <div className="empty">
          <p>Tu bolsa está vacía. Todavía.</p>
          <Link className="btn btn--ghost" href="/collections">
            <span>Seguir mirando</span>
          </Link>
        </div>
      ) : (
        <div className="co">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {cart.lines.map((l) => (
              <li key={l.id} className="cline" style={{ gridTemplateColumns: "88px 1fr" }}>
                <Link href={`/products/${l.productHandle}`} className="cline__img" style={{ background: l.tone }} aria-label={l.title} />
                <div className="cline__meta">
                  <div className="cline__top">
                    <Link href={`/products/${l.productHandle}`} className="cline__name serif">
                      {l.title}
                    </Link>
                    <span>{formatMoney(l.unitPrice.amount * l.quantity, l.unitPrice.currencyCode)}</span>
                  </div>
                  <div className="cline__sub mono">
                    {l.variantTitle} · {l.code}
                  </div>
                  <div className="cline__row">
                    <div className="qty" role="group" aria-label={`Cantidad de ${l.title}`}>
                      <button onClick={() => setQuantity(l.id, l.quantity - 1)} aria-label="Restar uno">
                        −
                      </button>
                      <span aria-live="polite">{l.quantity}</span>
                      <button onClick={() => setQuantity(l.id, l.quantity + 1)} aria-label="Sumar uno">
                        +
                      </button>
                    </div>
                    <button className="cline__remove" onClick={() => remove(l.id)}>
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="co__summary">
            <div className="co__line">
              <span>Subtotal</span>
              <span>{total}</span>
            </div>
            <div className="co__line" style={{ border: 0 }}>
              <span>Envío</span>
              <span className="mono" style={{ color: "var(--muted)" }}>
                Se calcula en el pago
              </span>
            </div>
            <div className="co__tot">
              <span>Total</span>
              <span>{total}</span>
            </div>
            <Link className="btn btn--block" href="/checkout" style={{ marginTop: 16 }}>
              <span>Tramitar el pedido</span>
            </Link>
            <p className="drawer__note mono" style={{ marginTop: 12 }}>
              Devoluciones en <span className="ph">30 días</span>. Cambios de talla, gratis.
            </p>
          </aside>
        </div>
      )}
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
