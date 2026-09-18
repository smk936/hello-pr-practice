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
    <div className="wrap" style={{ paddingBlock: "clamp(24px,4vh,50px)" }}>
      <header className="phead" style={{ paddingBottom: 20 }}>
        <span className="eyebrow">Cuenta</span>
        <h1 className="h-display">Hola, {user.name}.</h1>
      </header>
      <div className="acct-grid">
        <Link className="acct-card" href="/account/orders">
          <h3 className="serif">Mis pedidos</h3>
          <p>Historial y estado.</p>
        </Link>
        <Link className="acct-card" href="/wishlist">
          <h3 className="serif">Guardados</h3>
          <p>Lo que has guardado.</p>
        </Link>
        <div className="acct-card">
          <h3 className="serif">Sesión</h3>
          <p>{user.email}</p>
          <button className="linkish" onClick={logout} style={{ marginTop: 8, alignSelf: "flex-start" }}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
