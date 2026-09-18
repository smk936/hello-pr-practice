import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos. Respondemos personas, no bots.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="wrap">
      <header className="phead">
        <span className="eyebrow">Contacto</span>
        <h1 className="h-display">Escríbenos.</h1>
        <p>Respondemos personas, no bots, en 24–48 h laborables.</p>
      </header>
      <div className="prose" style={{ paddingBottom: "clamp(40px,8vh,90px)" }}>
        <ContactForm />
        <h2>Otros canales</h2>
        <p>
          Correo: <span className="ph">hola@cenit.example</span> ·{" "}
          <span className="ph">Datos de la empresa pendientes de completar</span>.
        </p>
      </div>
    </div>
  );
}
