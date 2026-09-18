import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "CENIT hace ropa para durar. Pocas piezas, bien resueltas.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">La marca</span>
        <h1 className="h-display">Ropa que se queda.</h1>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <p>
          CENIT hace ropa para el cajón donde guardas lo que no tiras. Pocas piezas, bien resueltas,
          pensadas para durar más de una temporada.
        </p>
        <h2>Cómo trabajamos</h2>
        <p>
          Series cortas y una idea sencilla: menos, y para más tiempo. Los datos concretos de
          producción, materiales y proveedores{" "}
          <span className="ph">se publican aquí a medida que los confirmamos</span> — nunca antes.
        </p>
        <h2>Dónde estamos</h2>
        <p>
          <span className="ph">Dirección y datos de la empresa — pendientes de completar con la información legal real.</span>
        </p>
      </div>
    </div>
  );
}
