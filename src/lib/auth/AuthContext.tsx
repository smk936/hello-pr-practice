"use client";

// ─────────────────────────────────────────────────────────────
// DEV auth adapter. Accounts live in this browser's localStorage only —
// there is NO server and this is NOT secure (do not use for real accounts).
// It exists so the account / login / register / orders flows are genuinely
// functional in development. Swap for a real provider (Shopify Customer
// Accounts, or your own backend) via AUTH_PROVIDER — see README.
// ─────────────────────────────────────────────────────────────
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface User {
  email: string;
  name: string;
}
interface StoredUser extends User {
  password: string;
}
interface Result {
  ok: boolean;
  error?: string;
}
interface AuthValue {
  user: User | null;
  ready: boolean;
  register: (d: { name: string; email: string; password: string }) => Result;
  login: (d: { email: string; password: string }) => Result;
  logout: () => void;
}

const KEY_USERS = "cenit.users.v1";
const KEY_SESSION = "cenit.session.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = read<User | null>(KEY_SESSION, null);
    if (session) setUser(session);
    setReady(true);
  }, []);

  const register = useCallback((d: { name: string; email: string; password: string }): Result => {
    const users = read<StoredUser[]>(KEY_USERS, []);
    if (users.some((u) => u.email.toLowerCase() === d.email.toLowerCase())) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    write(KEY_USERS, [...users, { name: d.name, email: d.email, password: d.password }]);
    const pub: User = { name: d.name, email: d.email };
    write(KEY_SESSION, pub);
    setUser(pub);
    return { ok: true };
  }, []);

  const login = useCallback((d: { email: string; password: string }): Result => {
    const users = read<StoredUser[]>(KEY_USERS, []);
    const found = users.find(
      (u) => u.email.toLowerCase() === d.email.toLowerCase() && u.password === d.password,
    );
    if (!found) return { ok: false, error: "Correo o contraseña incorrectos." };
    const pub: User = { name: found.name, email: found.email };
    write(KEY_SESSION, pub);
    setUser(pub);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(KEY_SESSION);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, ready, register, login, logout }),
    [user, ready, register, login, logout],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be used within <AuthProvider>");
  return v;
}
