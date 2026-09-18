"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { isEmail, isRequired, minLen } from "@/lib/validation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: { name?: string; email?: string; password?: string } = {};
    if (!isRequired(form.name)) er.name = "Nos falta tu nombre.";
    if (!isEmail(form.email)) er.email = "Ese correo no parece completo.";
    if (!minLen(form.password, 6)) er.password = "Mínimo 6 caracteres.";
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setLoading(true);
    const r = register(form);
    setLoading(false);
    if (!r.ok) {
      setErrors({ form: r.error });
      return;
    }
    router.push("/account");
  }

  return (
    <div className="wrap">
      <div className="narrow" style={{ paddingBlock: "clamp(30px,6vh,70px)" }}>
        <span className="eyebrow">Cuenta</span>
        <h1 className="h-display" style={{ margin: "12px 0 20px" }}>
          Crear cuenta
        </h1>
        <p className="notice" style={{ marginBottom: 22 }}>
          Modo desarrollo: las cuentas se guardan solo en este navegador y no son seguras. La
          autenticación real se conecta por variables de entorno.
        </p>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label className="label" htmlFor="name">Nombre</label>
            <input className="input" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} autoComplete="name" />
            <span className="error">{errors.name}</span>
          </div>
          <div className="field">
            <label className="label" htmlFor="email">Correo</label>
            <input className="input" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} autoComplete="email" />
            <span className="error">{errors.email}</span>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Contraseña</label>
            <input className="input" id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={!!errors.password} autoComplete="new-password" />
            <span className="error">{errors.password}</span>
          </div>
          {errors.form ? (
            <p className="error" style={{ marginBottom: 12 }} role="alert">
              {errors.form}
            </p>
          ) : null}
          <button className="btn btn--block" type="submit" disabled={loading}>
            <span>{loading ? "Creando…" : "Crear cuenta"}</span>
          </button>
        </form>
        <p className="form-note" style={{ marginTop: 16 }}>
          ¿Ya tienes cuenta?{" "}
          <Link className="linkish" href="/login">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
