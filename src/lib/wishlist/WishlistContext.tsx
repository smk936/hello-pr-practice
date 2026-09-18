"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cenit.wishlist.v1";

interface WishlistValue {
  handles: string[];
  ready: boolean;
  has: (handle: string) => boolean;
  toggle: (handle: string) => void;
  remove: (handle: string) => void;
}

const WishlistCtx = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [handles, setHandles] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setHandles(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    } catch {
      /* ignore */
    }
  }, [handles, ready]);

  const has = useCallback((handle: string) => handles.includes(handle), [handles]);
  const toggle = useCallback(
    (handle: string) =>
      setHandles((prev) => (prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle])),
    [],
  );
  const remove = useCallback((handle: string) => setHandles((prev) => prev.filter((h) => h !== handle)), []);

  const value = useMemo<WishlistValue>(
    () => ({ handles, ready, has, toggle, remove }),
    [handles, ready, has, toggle, remove],
  );

  return <WishlistCtx.Provider value={value}>{children}</WishlistCtx.Provider>;
}

export function useWishlist(): WishlistValue {
  const v = useContext(WishlistCtx);
  if (!v) throw new Error("useWishlist must be used within <WishlistProvider>");
  return v;
}
