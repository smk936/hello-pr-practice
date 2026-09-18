import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devoluciones y cambios",
  description: "Cómo devolver o cambiar una prenda.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <div className="wrap">
      <header className="phead phead--min">
        <span className="eyebrow">Ayuda</span>
        <h1>Devoluciones y cambios</h1>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <p>
          Si no es lo que esperabas, lo devuelves en <span className="ph">30 días</span>, en su estado
          original. La primera etiqueta la ponemos nosotros. El reembolso llega en{" "}
          <span className="ph">[X días]</span> a tu método de pago. Sin preguntas incómodas.
        </p>
        <h2>Cambios de talla</h2>
        <p>Los cambios de talla son gratis: te enviamos la talla correcta cuando recibimos la primera.</p>
        <h2>Cómo iniciar una devolución</h2>
        <p>
          <span className="ph">
            El proceso paso a paso (portal de devoluciones o correo) se completa con la operativa real.
          </span>
        </p>
      </div>
    </div>
  );
}
