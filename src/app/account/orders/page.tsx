"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders, type Order } from "@/lib/orders/store";
import { formatMoney } from "@/lib/format";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Cuenta</span>
        <h1 className="h-display">Mis pedidos</h1>
      </header>

      {orders === null ? (
        <p className="form-note">Cargando…</p>
      ) : orders.length === 0 ? (
        <div className="empty">
          <p>Todavía no tienes pedidos.</p>
          <Link className="btn btn--ghost" href="/collections">
            <span>Ver colecciones</span>
          </Link>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {orders.map((o) => (
            <li key={o.id} style={{ border: "1px solid var(--border)", padding: 18, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <span className="mono">
                  {o.id}
                  {o.mode === "test" ? " · prueba" : ""}
                </span>
                <span className="mono" style={{ color: "var(--muted)" }}>
                  {new Date(o.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div style={{ marginTop: 8, fontSize: ".9rem" }}>
                {o.items.map((i, idx) => (
                  <div key={idx}>
                    {i.quantity}× {i.title}{" "}
                    <span className="mono" style={{ color: "var(--muted)" }}>
                      ({i.variantTitle})
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontWeight: 500 }}>{formatMoney(o.subtotal, o.currencyCode)}</div>
            </li>
          ))}
        </ul>
      )}
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
