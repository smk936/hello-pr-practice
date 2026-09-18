import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Cómo tratamos tus datos.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Legal</span>
        <h1 className="h-display">Privacidad</h1>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <p className="notice">
          Documento pendiente de redacción legal. La estructura está lista; el texto definitivo debe
          revisarlo un profesional antes de publicar.
        </p>
        <h2>Qué datos recogemos</h2>
        <p><span className="ph">Pendiente: datos de pedido, cuenta y navegación.</span></p>
        <h2>Para qué los usamos</h2>
        <p><span className="ph">Pendiente: gestión de pedidos, atención y, con tu permiso, comunicaciones.</span></p>
        <h2>Tus derechos</h2>
        <p><span className="ph">Pendiente: acceso, rectificación, supresión y contacto del responsable (RGPD).</span></p>
      </div>
    </div>
  );
}
