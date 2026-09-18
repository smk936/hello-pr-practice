"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/format";

export function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, setQuantity, remove } = useCart();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const total = formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode);

  return (
    <>
      <div
        className={`scrim${drawerOpen ? " scrim--open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        className={`drawer${drawerOpen ? " drawer--open" : ""}`}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal={drawerOpen}
        aria-label="Tu bolsa"
      >
        <div className="drawer__head">
          <span className="mono">Tu bolsa ({cart.totalQuantity})</span>
          <button className="iconbtn" onClick={closeDrawer} aria-label="Cerrar bolsa">
            Cerrar
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="drawer__empty">
            <p className="serif" style={{ fontSize: "1.3rem" }}>
              Tu bolsa está vacía. Todavía.
            </p>
            <Link className="btn btn--ghost" href="/collections" onClick={closeDrawer}>
              <span>Seguir mirando</span>
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {cart.lines.map((l) => (
                <li key={l.id} className="cline">
                  <Link
                    href={`/products/${l.productHandle}`}
                    onClick={closeDrawer}
                    className="cline__img"
                    style={{ background: l.tone }}
                    aria-label={l.title}
                  />
                  <div className="cline__meta">
                    <div className="cline__top">
                      <Link
                        href={`/products/${l.productHandle}`}
                        onClick={closeDrawer}
                        className="cline__name serif"
                      >
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
            <div className="drawer__foot">
              <div className="drawer__sub">
                <span>Subtotal</span>
                <span>{total}</span>
              </div>
              <p className="drawer__note mono">Envío e impuestos se calculan en el pago.</p>
              <Link className="btn btn--block" href="/checkout" onClick={closeDrawer}>
                <span>Tramitar — {total}</span>
              </Link>
              <p className="drawer__note mono">
                Devoluciones en <span className="ph">30 días</span>. Cambios de talla, gratis.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
