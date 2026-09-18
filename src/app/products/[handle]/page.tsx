import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCommerce } from "@/lib/commerce/provider";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductCard } from "@/components/ProductCard";

export async function generateStaticParams() {
  const products = await getCommerce().getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getCommerce().getProduct(params.handle);
  if (!product) return {};
  return {
    title: product.title,
    description: product.subtitle,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: "website",
      url: `/products/${product.handle}`,
    },
  };
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <p>
      <strong style={{ fontWeight: 500 }}>{label}:</strong>{" "}
      {value ? value : <span className="ph">pendiente de dato real</span>}
    </p>
  );
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const commerce = getCommerce();
  const product = await commerce.getProduct(params.handle);
  if (!product) notFound();

  const all = await commerce.getAllProducts();
  const related = all
    .filter(
      (p) =>
        p.handle !== product.handle &&
        p.collectionHandles.some((h) => product.collectionHandles.includes(h)),
    )
    .slice(0, 4);

  // JSON-LD for rich results (uses only real, on-page data).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.code,
    description: product.subtitle,
    offers: {
      "@type": "Offer",
      priceCurrency: product.price.currencyCode,
      price: product.price.amount,
      availability: product.variants.some((v) => v.available)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <div className="wrap">
        <nav className="crumb mono" aria-label="Miga de pan" style={{ paddingTop: 20, color: "var(--muted)", fontSize: ".7rem" }}>
          <Link href="/collections">Colecciones</Link> / {product.title}
        </nav>

        <div className="pdp">
          <div className="gallery" aria-label="Galería de imágenes">
            {product.images.map((img, i) => (
              <figure className="gtile" style={{ background: img.tone }} key={i}>
                <span className="tag">
                  {String(i + 1).padStart(2, "0")} · {img.alt}
                </span>
              </figure>
            ))}
            <figure className="gtile" style={{ background: "#8C7A67" }}>
              <span className="tag">vídeo · [placeholder]</span>
            </figure>
          </div>

          <ProductBuy product={product} />
        </div>

        <section style={{ maxWidth: 720, paddingBlock: "clamp(40px,7vh,80px)" }}>
          {product.description.map((para, i) => (
            <p key={i} className="serif" style={{ fontSize: "1.15rem", lineHeight: 1.6, marginBottom: 6 }}>
              {para}
            </p>
          ))}

          <div style={{ marginTop: 26 }}>
            <details className="acc" open>
              <summary>
                Detalles <span className="pm">+</span>
              </summary>
              <div className="acc__body">
                <DetailRow label="Fit" value={product.details.fit} />
                <DetailRow label="Composición" value={product.details.composition} />
                <DetailRow label="Cuidados" value={product.details.care} />
                <DetailRow label="Origen" value={product.details.origin} />
              </div>
            </details>
            <details className="acc">
              <summary>
                Medidas y guía de tallas <span className="pm">+</span>
              </summary>
              <div className="acc__body">
                <p>
                  Modelo y medidas de la prenda: <span className="ph">pendiente de dato real</span>.
                </p>
                <p>
                  <Link className="linkish" href="/size-guide">
                    Abrir la guía de tallas ↗
                  </Link>
                </p>
              </div>
            </details>
            <details className="acc">
              <summary>
                Envío y devoluciones <span className="pm">+</span>
              </summary>
              <div className="acc__body">
                <p>
                  Envío en <span className="ph">48–72 h</span> con seguimiento. Devoluciones en{" "}
                  <span className="ph">30 días</span>, sin coste.
                </p>
                <p>
                  <Link className="linkish" href="/shipping">
                    Ver envíos
                  </Link>{" "}
                  ·{" "}
                  <Link className="linkish" href="/returns">
                    Ver devoluciones
                  </Link>
                </p>
              </div>
            </details>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section className="band">
          <div className="wrap sect">
            <div className="rowhead">
              <h2 className="serif">Se lleva con</h2>
              <Link className="link" href="/collections">
                Ver más <span className="arw">→</span>
              </Link>
            </div>
            <div className="pgrid">
              {related.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
