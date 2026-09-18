"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { isEmail, isRequired } from "@/lib/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: { email?: string; password?: string } = {};
    if (!isEmail(email)) er.email = "Ese correo no parece completo.";
    if (!isRequired(password)) er.password = "Escribe tu contraseña.";
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setLoading(true);
    const r = login({ email, password });
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
          Entrar
        </h1>
        <p className="notice" style={{ marginBottom: 22 }}>
          Modo desarrollo: las cuentas se guardan solo en este navegador. La autenticación real se
          conecta por variables de entorno.
        </p>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label className="label" htmlFor="email">Correo</label>
            <input className="input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} autoComplete="email" />
            <span className="error">{errors.email}</span>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Contraseña</label>
            <input className="input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} autoComplete="current-password" />
            <span className="error">{errors.password}</span>
          </div>
          {errors.form ? (
            <p className="error" style={{ marginBottom: 12 }} role="alert">
              {errors.form}
            </p>
          ) : null}
          <button className="btn btn--block" type="submit" disabled={loading}>
            <span>{loading ? "Entrando…" : "Entrar"}</span>
          </button>
        </form>
        <p className="form-note" style={{ marginTop: 16 }}>
          ¿No tienes cuenta?{" "}
          <Link className="linkish" href="/register">
            Crear una
          </Link>
        </p>
      </div>
    </div>
  );
}
