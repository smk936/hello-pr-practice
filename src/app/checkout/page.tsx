"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { saveOrder, type Order } from "@/lib/orders/store";
import { formatMoney } from "@/lib/format";
import { isEmail, isRequired } from "@/lib/validation";

export default function CheckoutPage() {
  const { cart, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    postal: "",
    country: "España",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, email: f.email || user.email, name: f.name || user.name }));
  }, [user]);

  const total = formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode);
  const set = (k: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const er: Record<string, string> = {};
    if (!isEmail(form.email)) er.email = "Ese correo no parece completo.";
    if (!isRequired(form.name)) er.name = "Nos falta tu nombre.";
    if (!isRequired(form.address)) er.address = "Nos falta la dirección.";
    if (!isRequired(form.city)) er.city = "Nos falta la ciudad.";
    if (!isRequired(form.postal)) er.postal = "Nos falta el código postal.";
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    if (cart.lines.length === 0 || !validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          items: cart.lines.map((l) => ({
            title: l.title,
            amount: l.unitPrice.amount,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "No se ha podido tramitar el pedido.");
        setLoading(false);
        return;
      }
      const order: Order = {
        id: data.orderId,
        createdAt: new Date().toISOString(),
        email: form.email,
        items: cart.lines.map((l) => ({
          title: l.title,
          variantTitle: l.variantTitle,
          quantity: l.quantity,
          amount: l.unitPrice.amount,
          currencyCode: l.unitPrice.currencyCode,
        })),
        subtotal: cart.subtotal.amount,
        currencyCode: cart.subtotal.currencyCode,
        mode: data.mode === "live" ? "live" : "test",
      };
      saveOrder(order);
      clear();
      router.push(`/checkout/confirmation/${order.id}`);
    } catch {
      setServerError("Ha fallado la conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className="wrap">
        <div className="empty" style={{ marginTop: 40 }}>
          <p>No hay nada que tramitar. Tu bolsa está vacía.</p>
          <Link className="btn btn--ghost" href="/collections">
            <span>Ver colecciones</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Pago</span>
        <h1 className="h-display">Tramitar</h1>
      </header>
      <div className="steps">
        <b>Datos</b>
        <span>·</span>
        <b>Envío</b>
        <span>·</span>
        <b>Pago</b>
      </div>

      <div className="co">
        <form onSubmit={submit} noValidate>
          <p className="notice" style={{ marginBottom: 20 }}>
            Compra como invitado, sin crear cuenta. Pago cifrado, procesado por{" "}
            <span className="ph">Stripe</span>. En modo desarrollo no se realiza ningún cargo.
          </p>

          <div className="field">
            <label className="label" htmlFor="email">Correo</label>
            <input className="input" id="email" type="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} autoComplete="email" />
            <span className="error">{errors.email}</span>
          </div>
          <div className="field">
            <label className="label" htmlFor="name">Nombre y apellidos</label>
            <input className="input" id="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} autoComplete="name" />
            <span className="error">{errors.name}</span>
          </div>
          <div className="field">
            <label className="label" htmlFor="address">Dirección</label>
            <input className="input" id="address" value={form.address} onChange={set("address")} aria-invalid={!!errors.address} autoComplete="street-address" />
            <span className="error">{errors.address}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label className="label" htmlFor="city">Ciudad</label>
              <input className="input" id="city" value={form.city} onChange={set("city")} aria-invalid={!!errors.city} autoComplete="address-level2" />
              <span className="error">{errors.city}</span>
            </div>
            <div className="field">
              <label className="label" htmlFor="postal">Código postal</label>
              <input className="input" id="postal" inputMode="numeric" value={form.postal} onChange={set("postal")} aria-invalid={!!errors.postal} autoComplete="postal-code" />
              <span className="error">{errors.postal}</span>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="country">País</label>
            <input className="input" id="country" value={form.country} onChange={set("country")} autoComplete="country-name" />
          </div>

          {serverError ? (
            <p className="error" style={{ marginBottom: 12 }} role="alert">
              {serverError}
            </p>
          ) : null}
          <button className="btn btn--block" type="submit" disabled={loading}>
            <span>{loading ? "Procesando…" : `Confirmar pedido — ${total}`}</span>
          </button>
          <p className="drawer__note mono" style={{ marginTop: 10 }}>
            No se te cobra hasta que confirmes.
          </p>
        </form>

        <aside className="co__summary">
          <div className="mono" style={{ fontSize: ".7rem", color: "var(--muted)", marginBottom: 12 }}>
            Tu pedido ({cart.totalQuantity})
          </div>
          {cart.lines.map((l) => (
            <div key={l.id} className="co__line">
              <span>
                {l.quantity}× {l.title}{" "}
                <span className="mono" style={{ color: "var(--muted)" }}>
                  {l.variantTitle}
                </span>
              </span>
              <span>{formatMoney(l.unitPrice.amount * l.quantity, l.unitPrice.currencyCode)}</span>
            </div>
          ))}
          <div className="co__tot">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </aside>
      </div>
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
