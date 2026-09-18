"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AccountPage() {
  const { user, ready, logout } = useAuth();

  if (!ready) {
    return (
      <div className="wrap" style={{ paddingBlock: 60 }}>
        <p className="form-note">Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wrap">
        <div className="narrow" style={{ paddingBlock: "clamp(30px,6vh,70px)" }}>
          <span className="eyebrow">Cuenta</span>
          <h1 className="h-display" style={{ margin: "12px 0 16px" }}>
            Tu cuenta
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 22 }}>
            Entra o crea una cuenta para ver tus pedidos y lo que has guardado.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link className="btn" href="/login">
              <span>Entrar</span>
            </Link>
            <Link className="btn btn--ghost" href="/register">
              <span>Crear cuenta</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="phead phead--min">
        <span className="eyebrow">Cuenta</span>
        <h1>Hola, {user.name}.</h1>
      </header>
      <div className="stacklist">
        <Link className="stackrow" href="/account/orders">
          <span className="idx">I</span>
          <div>
            <h3>Mis pedidos</h3>
            <p>Historial y estado.</p>
          </div>
          <span className="go">Ver →</span>
        </Link>
        <Link className="stackrow" href="/wishlist">
          <span className="idx">II</span>
          <div>
            <h3>Guardados</h3>
            <p>Lo que has guardado.</p>
          </div>
          <span className="go">Ver →</span>
        </Link>
        <div className="stackrow">
          <span className="idx">III</span>
          <div>
            <h3>Sesión</h3>
            <p>{user.email}</p>
          </div>
          <button className="go" onClick={logout} style={{ background: "none", border: 0, cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </div>
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
