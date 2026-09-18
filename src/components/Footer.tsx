import Link from "next/link";
import { Newsletter } from "@/components/Newsletter";

export function Footer() {
  return (
    <footer className="ft">
      <div className="ft__trust">
        <div>
          <h4>Envío</h4>
          <p>
            <span className="ph">48–72 h</span> · con seguimiento
          </p>
        </div>
        <div>
          <h4>Devoluciones</h4>
          <p>
            <span className="ph">30 días</span> · sin coste
          </p>
        </div>
        <div>
          <h4>Pago</h4>
          <p>Seguro y cifrado</p>
        </div>
        <div>
          <h4>Atención</h4>
          <p>Personas, no bots</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, borderBottom: "1px solid var(--border-2)" }}>
        <Newsletter />
      </div>

      <div className="wrap ft__grid">
        <div className="ft__brand">
          <div className="mark">
            CENIT<b>.</b>
          </div>
          <p style={{ opacity: 0.7, maxWidth: "26ch", marginTop: 12, fontSize: ".9rem" }}>
            Ropa que se queda.
          </p>
        </div>
        <div className="ft__col">
          <h4>Tienda</h4>
          <Link href="/collections/novedades">Novedades</Link>
          <Link href="/collections">Colecciones</Link>
          <Link href="/collections/rebajas">Rebajas</Link>
          <Link href="/wishlist">Guardados</Link>
        </div>
        <div className="ft__col">
          <h4>Ayuda</h4>
          <Link href="/shipping">Envíos</Link>
          <Link href="/returns">Devoluciones</Link>
          <Link href="/size-guide">Guía de tallas</Link>
          <Link href="/faq">Preguntas frecuentes</Link>
          <Link href="/contact">Contacto</Link>
        </div>
        <div className="ft__col">
          <h4>Marca</h4>
          <Link href="/about">Quiénes somos</Link>
          <Link href="/account">Mi cuenta</Link>
          <Link href="/account/orders">Mis pedidos</Link>
        </div>
        <div className="ft__col">
          <h4>Legal</h4>
          <Link href="/privacy">Privacidad</Link>
          <Link href="/terms">Términos</Link>
        </div>
      </div>

      <div className="wrap ft__legal">
        <span>© {new Date().getFullYear()} CENIT</span>
        <span>España · €</span>
      </div>
    </footer>
  );
}
