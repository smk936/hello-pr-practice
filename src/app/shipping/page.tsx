import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos",
  description: "Plazos, coste y seguimiento de tus envíos.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Ayuda</span>
        <h1 className="h-display">Envíos</h1>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <p>
          Preparamos tu pedido en <span className="ph">1–2 días</span> y lo enviamos con{" "}
          <span className="ph">[transportista]</span>, con seguimiento. Los plazos son estimaciones;
          si algo cambia, te avisamos.
        </p>
        <h2>Plazos y coste</h2>
        <table>
          <thead>
            <tr>
              <th>Destino</th>
              <th>Plazo estimado</th>
              <th>Coste</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Península</td>
              <td><span className="ph">48–72 h</span></td>
              <td><span className="ph">gratis desde X €</span></td>
            </tr>
            <tr>
              <td>Baleares / Canarias</td>
              <td><span className="ph">por confirmar</span></td>
              <td><span className="ph">por confirmar</span></td>
            </tr>
            <tr>
              <td>UE</td>
              <td><span className="ph">por confirmar</span></td>
              <td><span className="ph">por confirmar</span></td>
            </tr>
          </tbody>
        </table>
        <p>Los valores marcados se sustituyen por las tarifas y plazos reales del transportista.</p>
      </div>
    </div>
  );
}
