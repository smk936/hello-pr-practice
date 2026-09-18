import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Tallas, envíos, devoluciones y pago.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "¿Cómo elijo mi talla?",
    a: (
      <>
        Consulta la <Link className="linkish" href="/size-guide">guía de tallas</Link>. La
        recomendación de fit de cada prenda aparece en su ficha.
      </>
    ),
  },
  {
    q: "¿Cuánto tarda el envío?",
    a: (
      <>
        Plazo estimado: <span className="ph">48–72 h</span> laborables, con seguimiento. Los tiempos
        reales se confirman con el transportista. Ver <Link className="linkish" href="/shipping">envíos</Link>.
      </>
    ),
  },
  {
    q: "¿Puedo devolver o cambiar una prenda?",
    a: (
      <>
        Sí, dentro de <span className="ph">30 días</span>, en su estado original. Los cambios de talla
        son gratis. Ver <Link className="linkish" href="/returns">devoluciones</Link>.
      </>
    ),
  },
  {
    q: "¿Cómo puedo pagar?",
    a: <>Con los métodos que verás en el checkout. El pago va cifrado y procesado por <span className="ph">Stripe</span>.</>,
  },
];

export default function FaqPage() {
  return (
    <div className="wrap">
      <header className="phead phead--min">
        <span className="eyebrow">Ayuda</span>
        <h1>Preguntas frecuentes</h1>
      </header>
      <div className="faq" style={{ maxWidth: 720, paddingBottom: "clamp(40px,8vh,90px)" }}>
        {FAQS.map((f, i) => (
          <details key={i} open={i === 0}>
            <summary>
              {f.q} <span aria-hidden="true">+</span>
            </summary>
            <div className="acc__body">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
