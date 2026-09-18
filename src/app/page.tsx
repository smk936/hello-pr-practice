import Link from "next/link";
import type { Metadata } from "next";
import { getCommerce } from "@/lib/commerce/provider";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const commerce = getCommerce();
  const [all, collections] = await Promise.all([
    commerce.getAllProducts(),
    commerce.getCollections(),
  ]);

  const selection = [...all]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);
  const heroTone = selection[0]?.card.a ?? "#B9A48F";

  const worlds = ["camisas", "punto", "abrigos"]
    .map((h) => ({
      c: collections.find((x) => x.handle === h),
      tone: all.find((p) => p.collectionHandles.includes(h))?.card.a ?? "#B9A48F",
    }))
    .filter((w): w is { c: NonNullable<typeof w.c>; tone: string } => Boolean(w.c));

  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div className="hero__txt">
            <span className="eyebrow">Otoño ’26 — Vol. 01</span>
            <h1 className="h-display">
              Cinco prendas.
              <br />
              Un otoño entero.
            </h1>
            <p className="lede center-measure">
              Ropa hecha para durar, no para el scroll. Empieza por lo último que hemos hecho.
            </p>
            <div>
              <Link className="link" href="/collections/novedades">
                Ver la colección <span className="arw">→</span>
              </Link>
            </div>
          </div>
          <div className="hero__img" style={{ background: heroTone }}>
            <i className="sh" style={{ inset: "0 0 40% 46%" }} />
          </div>
        </section>
      </div>

      <section className="band">
        <div className="wrap manifesto">
          <p>
            No hacemos ropa para una temporada. La hacemos para el cajón donde guardas{" "}
            <em>lo que no tiras.</em>
          </p>
        </div>
      </section>

      <section className="band">
        <div className="worlds">
          {worlds.map((w) => (
            <Link
              key={w.c.handle}
              href={`/collections/${w.c.handle}`}
              className="world"
              style={{ background: w.tone }}
            >
              <span className="sh" />
              <span className="lab">{w.c.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap sect">
          <div className="rowhead">
            <h2 className="serif">La selección</h2>
            <Link className="link" href="/collections/novedades">
              Ver todo <span className="arw">→</span>
            </Link>
          </div>
          <div className="pgrid">
            {selection.map((p) => (
              <ProductCard key={p.handle} product={p} sig={p.tags.includes("novedad") ? "Nuevo" : undefined} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
