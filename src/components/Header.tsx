"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { SearchOverlay } from "@/components/SearchOverlay";

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

const IconMenu = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="16" x2="21" y2="16" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 20c0-3.3 3.1-5.6 7-5.6s7 2.3 7 5.6" />
  </svg>
);
const IconBag = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 8h12l-1 12H7L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export function Header() {
  const { cart, openDrawer } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
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
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="iconbtn hdr__menu hdr__ic" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <IconMenu />
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
            <button className="iconbtn hdr__ic" onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <IconSearch />
              <span className="lbl">Buscar</span>
            </button>
            <Link className="iconbtn hdr__ic" href="/account" aria-label="Cuenta">
              <IconUser />
              <span className="lbl">Cuenta</span>
            </Link>
            <button className="iconbtn hdr__ic" onClick={openDrawer} aria-label={`Abrir bolsa, ${count} artículos`}>
              <IconBag />
              {count > 0 ? <span className="count">{count}</span> : null}
              <span className="lbl">Bolsa</span>
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
        <button
          className="iconbtn hdr__ic"
          onClick={() => {
            setMenuOpen(false);
            setSearchOpen(true);
          }}
          style={{ border: "1px solid var(--border)", padding: 13, justifyContent: "flex-start", marginBottom: 18, minHeight: 48 }}
        >
          <IconSearch /> Buscar
        </button>
        <nav className="mnav__list" aria-label="Navegación móvil">
          {[...NAV, ...MOBILE_EXTRA].map((n) => (
            <Link key={n.href} href={n.href} tabIndex={menuOpen ? 0 : -1}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mnav__foot">
          <Link href="/account">Cuenta</Link>
          <Link href="/wishlist">Guardados</Link>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
