"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/lib/orders/store";
import { formatMoney } from "@/lib/format";

export default function ConfirmationPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrder(params.orderId));
  }, [params.orderId]);

  const isTest = order?.mode === "test" || params.orderId.startsWith("TEST-");

  return (
    <div className="wrap">
      <div style={{ maxWidth: 640, paddingBlock: "clamp(36px,8vh,90px)" }}>
        <span className="eyebrow">Pedido confirmado</span>
        <h1 className="h-display" style={{ margin: "12px 0 14px" }}>
          Gracias.
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          Tu pedido{" "}
          <b className="mono" style={{ color: "var(--text)" }}>
            {params.orderId}
          </b>{" "}
          está confirmado. Te hemos escrito un correo con los detalles.
        </p>

        {order ? (
          <div style={{ border: "1px solid var(--border)", padding: 18, marginBottom: 20 }}>
            {order.items.map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>
                  {i.quantity}× {i.title}{" "}
                  <span className="mono" style={{ color: "var(--muted)" }}>
                    ({i.variantTitle})
                  </span>
                </span>
                <span>{formatMoney(i.amount * i.quantity, i.currencyCode)}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid var(--border)",
                marginTop: 8,
                paddingTop: 10,
                fontWeight: 500,
              }}
            >
              <span>Total</span>
              <span>{formatMoney(order.subtotal, order.currencyCode)}</span>
            </div>
          </div>
        ) : null}

        {isTest ? (
          <p className="notice" style={{ marginBottom: 20 }}>
            Pedido de prueba (modo desarrollo). No se ha realizado ningún cargo. Con Stripe configurado,
            aquí iría el pago real.
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn--ghost" href="/collections">
            <span>Seguir comprando</span>
          </Link>
          <Link className="btn btn--ghost" href="/account/orders">
            <span>Mis pedidos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
