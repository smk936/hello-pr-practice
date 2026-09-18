import Link from "next/link";
import type { Metadata } from "next";
import { getCommerce } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Colecciones",
  description: "Camisas, punto, sastrería suave, pantalones y abrigos. Por dónde empezar.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsIndex() {
  const commerce = getCommerce();
  const [collections, all] = await Promise.all([
    commerce.getCollections(),
    commerce.getAllProducts(),
  ]);
  const toneFor = (h: string) =>
    all.find((p) => p.collectionHandles.includes(h))?.card.a ?? "#B9A48F";

  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Colecciones</span>
        <h1 className="h-display">Por dónde empezar.</h1>
      </header>
      <div className="worlds">
        {collections.map((c) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="world" style={{ background: toneFor(c.handle) }}>
            <span className="sh" />
            <span className="lab">{c.title}</span>
          </Link>
        ))}
      </div>
      <div style={{ height: "clamp(40px,8vh,90px)" }} />
    </div>
  );
}
