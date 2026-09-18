import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos",
  description: "Condiciones de compra y uso.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="wrap">
      <header className="phead phead--min">
        <span className="eyebrow">Legal</span>
        <h1>Términos</h1>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <p className="notice">
          Documento pendiente de redacción legal. La estructura está lista; el texto definitivo debe
          revisarlo un profesional antes de publicar.
        </p>
        <h2>Condiciones de compra</h2>
        <p><span className="ph">Pendiente: precios, impuestos, disponibilidad y confirmación del pedido.</span></p>
        <h2>Envíos y devoluciones</h2>
        <p><span className="ph">Pendiente: remite a las páginas de envíos y devoluciones.</span></p>
        <h2>Responsabilidad y ley aplicable</h2>
        <p><span className="ph">Pendiente: jurisdicción y datos de la empresa.</span></p>
      </div>
    </div>
  );
}
