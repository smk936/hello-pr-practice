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
  const editTone = all.find((p) => p.collectionHandles.includes("punto"))?.card.a ?? "#6F7A6A";

  const worlds = ["camisas", "punto", "abrigos"]
    .map((h) => ({
      c: collections.find((x) => x.handle === h),
      tone: all.find((p) => p.collectionHandles.includes(h))?.card.a ?? "#B9A48F",
    }))
    .filter((w): w is { c: NonNullable<typeof w.c>; tone: string } => Boolean(w.c));

  return (
    <>
      {/* HERO — full-bleed tone, caption breaks the image */}
      <section className="hero2">
        <div className="hero2__img" style={{ background: heroTone }} />
        <div className="wrap">
          <div className="hero2__caption">
            <span className="eyebrow">Otoño ’26 — Vol. 01</span>
            <h1 className="h-display">
              Cinco prendas.
              <br />
              Un otoño entero.
            </h1>
            <div>
              <Link className="link" href="/collections/novedades">
                Ver la colección <span className="arw">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="band">
        <div className="wrap manifesto">
          <p>
            No hacemos ropa para una temporada. La hacemos para el cajón donde guardas{" "}
            <em>lo que no tiras.</em>
          </p>
        </div>
      </section>

      {/* EDITORIAL — dark ground */}
      <section className="band band--dark">
        <div className="wrap sect">
          <div className="edit">
            <div className="edit__img" style={{ background: editTone }} />
            <div className="edit__txt">
              <span className="eyebrow">La materia</span>
              <h2>Se nota en la mano.</h2>
              <p>
                Punto que pesa lo justo, sastrería sin rigidez, lino que se arruga como debe. Piezas
                pensadas para años, no para una temporada.
              </p>
              <div className="edit__meta">
                Composición: <span className="ph">pendiente de dato real</span>
                <br />
                Acabado: <span className="ph">pendiente de dato real</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORLDS — asymmetric */}
      <section className="band">
        <div className="wrap sect">
          <div className="rowhead">
            <h2 className="serif">Por dónde empezar</h2>
            <Link className="link" href="/collections">
              Todas <span className="arw">→</span>
            </Link>
          </div>
          <div className="worlds2">
            {worlds.map((w) => (
              <Link key={w.c.handle} href={`/collections/${w.c.handle}`} className="world" style={{ background: w.tone }}>
                <span className="sh" />
                <span className="lab">{w.c.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTION */}
      <section className="band">
        <div className="wrap" style={{ paddingBlock: "clamp(40px,7vh,90px)" }}>
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

      {/* REGISTRO — Almagre ground, deliberate */}
      <section className="band registro-band">
        <div className="wrap sect">
          <span className="eyebrow" style={{ color: "var(--bone)", opacity: 0.8 }}>
            El registro
          </span>
          <h2 className="serif" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", margin: "12px 0 24px" }}>
            Sin letra pequeña.
          </h2>
          <dl className="registro">
            <div className="reg-row">
              <dt>Envío</dt>
              <dd>
                <span className="ph">48–72 h</span> · con seguimiento
              </dd>
            </div>
            <div className="reg-row">
              <dt>Devoluciones</dt>
              <dd>
                <span className="ph">30 días</span> · sin coste
              </dd>
            </div>
            <div className="reg-row">
              <dt>Materia</dt>
              <dd>
                <span className="ph">pendiente de dato real</span>
              </dd>
            </div>
            <div className="reg-row">
              <dt>Producción</dt>
              <dd>
                <span className="ph">series cortas</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
