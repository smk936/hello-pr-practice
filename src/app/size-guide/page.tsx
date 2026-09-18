import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description: "Medidas del cuerpo y cómo medir.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Ayuda</span>
        <h1 className="h-display">Guía de tallas</h1>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <p>
          Medidas del cuerpo en centímetros.{" "}
          <span className="ph">Los valores son de ejemplo y se sustituyen por la tabla real.</span>
        </p>
        <table>
          <thead>
            <tr>
              <th>Talla</th>
              <th>Pecho</th>
              <th>Cintura</th>
              <th>Cadera</th>
            </tr>
          </thead>
          <tbody>
            {["XS", "S", "M", "L", "XL"].map((t) => (
              <tr key={t}>
                <td>{t}</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Cómo medir</h2>
        <p>
          <span className="ph">
            Instrucciones de medición (pecho, cintura, cadera) — se completan con el contenido real.
          </span>
        </p>
      </div>
    </div>
  );
}
