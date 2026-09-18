"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBox({ initial }: { initial: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
      }}
      style={{ display: "flex", gap: 10, maxWidth: 540 }}
    >
      <input
        className="input"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca una prenda, un color…"
        aria-label="Buscar productos"
        autoComplete="off"
      />
      <button className="btn" type="submit">
        <span>Buscar</span>
      </button>
    </form>
  );
}
