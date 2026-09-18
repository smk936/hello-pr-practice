"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";

const NAV = [
  { href: "/collections/novedades", label: "Novedades" },
  { href: "/collections/camisas", label: "Camisas" },
  { href: "/collections/punto", label: "Punto" },
  { href: "/collections/sastreria", label: "Sastrería" },
  { href: "/collections/rebajas", label: "Rebajas" },
];

const MOBILE_EXTRA = [
  { href: "/collections/pantalones", label: "Pantalones" },
  { href: "/collections/abrigos", label: "Abrigos" },
  { href: "/collections", label: "Todas las colecciones" },
];

export function Header() {
  const { cart, openDrawer } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const count = cart.totalQuantity;

  return (
    <>
      <header className="hdr">
        <div className="wrap hdr__in">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="iconbtn hdr__menu"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              Menú
            </button>
            <Link className="hdr__brand" href="/">
              CENIT<b>.</b>
            </Link>
          </div>
          <nav className="hdr__nav" aria-label="Navegación principal">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hdr__actions">
            <Link className="iconbtn" href="/search">
              Buscar
            </Link>
            <Link className="iconbtn" href="/account">
              Cuenta
            </Link>
            <button className="iconbtn" onClick={openDrawer} aria-label={`Abrir bolsa, ${count} artículos`}>
              Bolsa <span className="count">({count})</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mnav" data-open={menuOpen} aria-hidden={!menuOpen}>
        <div className="mnav__top">
          <span className="hdr__brand">
            CENIT<b>.</b>
          </span>
          <button className="iconbtn" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
            Cerrar
          </button>
        </div>
        <nav className="mnav__list" aria-label="Navegación móvil">
          {[...NAV, ...MOBILE_EXTRA].map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mnav__foot">
          <Link href="/search">Buscar</Link>
          <Link href="/account">Cuenta</Link>
          <Link href="/wishlist">Guardados</Link>
        </div>
      </div>
    </>
  );
}
