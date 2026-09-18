"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

const SUGGESTIONS = [
  { href: "/collections/novedades", label: "Novedades" },
  { href: "/collections/camisas", label: "Camisas" },
  { href: "/collections/punto", label: "Punto" },
  { href: "/collections/rebajas", label: "Rebajas" },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    onClose();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <div className="search-ov" data-open={open} aria-hidden={!open} role="dialog" aria-modal={open} aria-label="Buscar">
      <form className="search-ov__top" onSubmit={submit} role="search">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca una prenda, un color…"
          aria-label="Buscar productos"
          autoComplete="off"
          tabIndex={open ? 0 : -1}
        />
        <button type="button" className="iconbtn" onClick={onClose} aria-label="Cerrar búsqueda">
          Cerrar
        </button>
      </form>
      <div>
        <span className="eyebrow">Sugerencias</span>
        <nav className="mnav__list" style={{ marginTop: 12 }} aria-label="Sugerencias de búsqueda">
          {SUGGESTIONS.map((s) => (
            <Link key={s.href} href={s.href} onClick={onClose} tabIndex={open ? 0 : -1}>
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
