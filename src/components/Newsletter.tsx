"use client";

import { useState, type FormEvent } from "react";
import { isEmail } from "@/lib/validation";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setErr("Ese correo no parece completo.");
      return;
    }
    setErr("");
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || "No se ha podido suscribir.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setErr("Ha fallado la conexión.");
      setStatus("error");
    }
  }

  return (
    <div className="nl">
      <h4 className="serif">Una carta al mes.</h4>
      <p>Nuevas piezas, cómo cuidarlas, y poco más. Sin spam, sin cuentas atrás.</p>
      {status === "ok" ? (
        <p className="nl__ok">Hecho. Nos vemos una vez al mes.</p>
      ) : (
        <form onSubmit={submit} noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo"
            aria-label="Tu correo"
            autoComplete="email"
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "…" : "Apuntarme"}
          </button>
        </form>
      )}
      {err ? (
        <p className="error" style={{ marginTop: 8 }} role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}
