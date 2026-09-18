import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommerce } from "@/lib/commerce/provider";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import type { SortKey } from "@/lib/commerce/types";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const c = await getCommerce().getCollection(params.handle);
  if (!c) return {};
  return { title: c.title, description: c.intro, alternates: { canonical: `/collections/${c.handle}` } };
}

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

  const sig =
    collection.handle === "novedades" ? "Nuevo" : collection.handle === "rebajas" ? "Rebaja" : undefined;

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Colección</span>
        <h1 className="h-display">{collection.title}</h1>
        <p>{collection.intro}</p>
      </header>

      <FilterBar
        handle={params.handle}
        allColors={allColors}
        allSizes={allSizes}
        colors={colors}
        sizes={sizes}
        sale={sale}
        sort={sort}
      />

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
