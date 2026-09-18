import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommerce } from "@/lib/commerce/provider";
import { ProductCard } from "@/components/ProductCard";
import type { SortKey } from "@/lib/commerce/types";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const c = await getCommerce().getCollection(params.handle);
  if (!c) return {};
  return { title: c.title, description: c.intro, alternates: { canonical: `/collections/${c.handle}` } };
}

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Destacados" },
  { key: "newest", label: "Novedades" },
  { key: "price-asc", label: "Precio ↑" },
  { key: "price-desc", label: "Precio ↓" },
];

function toArr(v?: string | string[]): string[] {
  return v == null ? [] : Array.isArray(v) ? v : [v];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: SearchParams;
}) {
  const commerce = getCommerce();
  const collection = await commerce.getCollection(params.handle);
  if (!collection) notFound();

  const sort = (typeof searchParams.sort === "string" ? searchParams.sort : "featured") as SortKey;
  const colors = toArr(searchParams.color);
  const sizes = toArr(searchParams.size);
  const sale = searchParams.sale === "1";

  const [facetSource, products] = await Promise.all([
    commerce.getProductsInCollection(params.handle),
    commerce.getProductsInCollection(params.handle, {
      sort,
      filters: { colors, sizes, onSale: sale || undefined },
    }),
  ]);

  const allColors = Array.from(
    new Set(facetSource.flatMap((p) => p.options.find((o) => o.name === "Color")?.values ?? [])),
  );
  const allSizes = Array.from(
    new Set(facetSource.flatMap((p) => p.options.find((o) => o.name === "Talla")?.values ?? [])),
  );

  function hrefWith(next: { sort?: SortKey; colors?: string[]; sizes?: string[]; sale?: boolean }) {
    const s = { sort, colors, sizes, sale, ...next };
    const sp = new URLSearchParams();
    if (s.sort && s.sort !== "featured") sp.set("sort", s.sort);
    for (const c of s.colors) sp.append("color", c);
    for (const z of s.sizes) sp.append("size", z);
    if (s.sale) sp.set("sale", "1");
    const q = sp.toString();
    return `/collections/${params.handle}${q ? `?${q}` : ""}`;
  }
  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const hasFilters = colors.length > 0 || sizes.length > 0 || sale;
  const sig =
    collection.handle === "novedades" ? "Nuevo" : collection.handle === "rebajas" ? "Rebaja" : undefined;

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Colección</span>
        <h1 className="h-display">{collection.title}</h1>
        <p>{collection.intro}</p>
      </header>

      <div className="toolbar">
        <div className="filterbar">
          {allColors.map((c) => (
            <Link key={c} className="chip" data-active={colors.includes(c)} href={hrefWith({ colors: toggle(colors, c) })}>
              {c}
            </Link>
          ))}
          {allSizes.map((z) => (
            <Link key={z} className="chip" data-active={sizes.includes(z)} href={hrefWith({ sizes: toggle(sizes, z) })}>
              {z}
            </Link>
          ))}
          <Link className="chip" data-active={sale} href={hrefWith({ sale: !sale })}>
            Rebajas
          </Link>
          {hasFilters ? (
            <Link className="chip" href={hrefWith({ colors: [], sizes: [], sale: false })}>
              Limpiar
            </Link>
          ) : null}
        </div>
        <div className="filterbar">
          {SORTS.map((s) => (
            <Link key={s.key} className="chip" data-active={sort === s.key} href={hrefWith({ sort: s.key })}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="count mono" style={{ marginBottom: 18 }}>
        {products.length} {products.length === 1 ? "pieza" : "piezas"}
      </p>

      {products.length === 0 ? (
        <div className="empty">
          <p>No hay piezas con estos filtros.</p>
          <Link className="btn btn--ghost" href={`/collections/${params.handle}`}>
            <span>Quitar filtros</span>
          </Link>
        </div>
      ) : (
        <div className="pgrid">
          {products.map((p) => (
            <ProductCard key={p.handle} product={p} sig={sig} />
          ))}
        </div>
      )}
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
