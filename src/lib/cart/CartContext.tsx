"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { Cart, CartLine } from "@/lib/commerce/types";

const STORAGE_KEY = "cenit.cart.v1";

type AddPayload = Omit<CartLine, "quantity"> & { quantity?: number };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: AddPayload }
  | { type: "setQty"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const qty = action.line.quantity ?? 1;
      const i = state.findIndex((l) => l.id === action.line.id);
      if (i >= 0) {
        const next = [...state];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      }
      return [...state, { ...action.line, quantity: qty }];
    }
    case "setQty":
      if (action.quantity <= 0) return state.filter((l) => l.id !== action.id);
      return state.map((l) => (l.id === action.id ? { ...l, quantity: action.quantity } : l));
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "clear":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  cart: Cart;
  ready: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (line: AddPayload) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartCtx = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
      }
    } catch {
      /* private mode / blocked storage — start empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota / blocked storage */
    }
  }, [lines, ready]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const add = useCallback((line: AddPayload) => {
    dispatch({ type: "add", line });
    setDrawerOpen(true);
  }, []);
  const setQuantity = useCallback(
    (id: string, quantity: number) => dispatch({ type: "setQty", id, quantity }),
    [],
  );
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const cart = useMemo<Cart>(() => {
    const currency = lines[0]?.unitPrice.currencyCode ?? "EUR";
    const subtotal = lines.reduce((s, l) => s + l.unitPrice.amount * l.quantity, 0);
    const totalQuantity = lines.reduce((s, l) => s + l.quantity, 0);
    return { lines, subtotal: { amount: subtotal, currencyCode: currency }, totalQuantity };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({ cart, ready, drawerOpen, openDrawer, closeDrawer, add, setQuantity, remove, clear }),
    [cart, ready, drawerOpen, openDrawer, closeDrawer, add, setQuantity, remove, clear],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart(): CartContextValue {
  const v = useContext(CartCtx);
  if (!v) throw new Error("useCart must be used within <CartProvider>");
  return v;
}
