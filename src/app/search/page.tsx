import Link from "next/link";
import type { Metadata } from "next";
import { getCommerce } from "@/lib/commerce/provider";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca entre las prendas de CENIT.",
  alternates: { canonical: "/search" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string | string[] };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = q ? await getCommerce().searchProducts(q) : [];

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Buscar</span>
        <h1 className="h-display">¿Qué buscas?</h1>
      </header>

      <SearchBox initial={q} />

      {q ? (
        results.length > 0 ? (
          <>
            <p className="count mono" style={{ margin: "20px 0" }}>
              {results.length} resultado{results.length === 1 ? "" : "s"} para “{q}”.
            </p>
            <div className="pgrid">
              {results.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty" style={{ marginTop: 22 }}>
            <p>Nada con ese nombre. Prueba con menos palabras.</p>
            <Link className="btn btn--ghost" href="/collections">
              <span>Ver colecciones</span>
            </Link>
          </div>
        )
      ) : (
        <p className="form-note" style={{ marginTop: 16 }}>
          Escribe una prenda, un color o una categoría.
        </p>
      )}
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
