"use client";

import { useState, type FormEvent } from "react";
import { isEmail, isRequired, minLen } from "@/lib/validation";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [serverError, setServerError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!isRequired(form.name)) er.name = "Nos falta tu nombre.";
    if (!isEmail(form.email)) er.email = "Ese correo no parece completo.";
    if (!minLen(form.message, 5)) er.message = "Cuéntanos un poco más.";
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setServerError(data.error || "No se ha podido enviar.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setServerError("Ha fallado la conexión. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="empty" style={{ textAlign: "left", maxWidth: 520 }}>
        <p className="serif" style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: 8 }}>
          Recibido.
        </p>
        <p>
          Gracias por escribir. Contestamos en <span className="ph">24–48 h</span> laborables.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ maxWidth: 520 }}>
      <div className="field">
        <label className="label" htmlFor="name">Nombre</label>
        <input className="input" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
        <span className="error">{errors.name}</span>
      </div>
      <div className="field">
        <label className="label" htmlFor="email">Correo</label>
        <input className="input" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} autoComplete="email" />
        <span className="error">{errors.email}</span>
      </div>
      <div className="field">
        <label className="label" htmlFor="message">Mensaje</label>
        <textarea className="input" id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} />
        <span className="error">{errors.message}</span>
      </div>
      {serverError ? (
        <p className="error" style={{ marginBottom: 12 }} role="alert">
          {serverError}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={status === "loading"}>
        <span>{status === "loading" ? "Enviando…" : "Enviar"}</span>
      </button>
    </form>
  );
}
