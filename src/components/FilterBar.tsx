"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SortKey } from "@/lib/commerce/types";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Destacados" },
  { key: "newest", label: "Novedades" },
  { key: "price-asc", label: "Precio ↑" },
  { key: "price-desc", label: "Precio ↓" },
];

interface Props {
  handle: string;
  allColors: string[];
  allSizes: string[];
  colors: string[];
  sizes: string[];
  sale: boolean;
  sort: SortKey;
}

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function FilterBar(p: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lSort, setLSort] = useState<SortKey>(p.sort);
  const [lColors, setLColors] = useState<string[]>(p.colors);
  const [lSizes, setLSizes] = useState<string[]>(p.sizes);
  const [lSale, setLSale] = useState<boolean>(p.sale);

  useEffect(() => {
    setLSort(p.sort);
    setLColors(p.colors);
    setLSizes(p.sizes);
    setLSale(p.sale);
  }, [p.sort, p.colors, p.sizes, p.sale]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function serialize(s: { sort: SortKey; colors: string[]; sizes: string[]; sale: boolean }) {
    const sp = new URLSearchParams();
    if (s.sort && s.sort !== "featured") sp.set("sort", s.sort);
    for (const c of s.colors) sp.append("color", c);
    for (const z of s.sizes) sp.append("size", z);
    if (s.sale) sp.set("sale", "1");
    const q = sp.toString();
    return `/collections/${p.handle}${q ? `?${q}` : ""}`;
  }
  const hrefWith = (next: Partial<{ sort: SortKey; colors: string[]; sizes: string[]; sale: boolean }>) =>
    serialize({ sort: p.sort, colors: p.colors, sizes: p.sizes, sale: p.sale, ...next });
  const activeCount = p.colors.length + p.sizes.length + (p.sale ? 1 : 0);

  function apply() {
    setOpen(false);
    router.push(serialize({ sort: lSort, colors: lColors, sizes: lSizes, sale: lSale }));
  }
  function clearLocal() {
    setLSort("featured");
    setLColors([]);
    setLSizes([]);
    setLSale(false);
  }

  return (
    <>
      {/* Desktop: inline chips (navigate on click) */}
      <div className="filter-desktop">
        <div className="filterbar">
          {p.allColors.map((c) => (
            <Link key={c} className="chip" data-active={p.colors.includes(c)} href={hrefWith({ colors: toggle(p.colors, c) })}>
              {c}
            </Link>
          ))}
          {p.allSizes.map((z) => (
            <Link key={z} className="chip" data-active={p.sizes.includes(z)} href={hrefWith({ sizes: toggle(p.sizes, z) })}>
              {z}
            </Link>
          ))}
          <Link className="chip" data-active={p.sale} href={hrefWith({ sale: !p.sale })}>
            Rebajas
          </Link>
          {activeCount > 0 ? (
            <Link className="chip" href={hrefWith({ colors: [], sizes: [], sale: false })}>
              Limpiar
            </Link>
          ) : null}
        </div>
        <div className="filterbar">
          {SORTS.map((s) => (
            <Link key={s.key} className="chip" data-active={p.sort === s.key} href={hrefWith({ sort: s.key })}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: sticky triggers → bottom sheet */}
      <div className="filter-mobile">
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
          Filtrar{activeCount > 0 ? <span className="n"> ({activeCount})</span> : null}
        </button>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
          Ordenar
        </button>
      </div>

      <div className="sheet-scrim" data-open={open} onClick={() => setOpen(false)} aria-hidden={!open} />
      <div className="sheet" data-open={open} role="dialog" aria-modal={open} aria-label="Filtrar y ordenar">
        <div className="sheet__grab" aria-hidden="true" />
        <div className="sheet__head">
          <h3>Filtrar y ordenar</h3>
          <button className="iconbtn" onClick={() => setOpen(false)} aria-label="Cerrar">
            Cerrar
          </button>
        </div>
        <div className="sheet__body">
          <div className="opt-group">
            <h4>Ordenar por</h4>
            <div className="opt-row">
              {SORTS.map((s) => (
                <button key={s.key} type="button" className="opt" data-active={lSort === s.key} onClick={() => setLSort(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {p.allColors.length > 0 && (
            <div className="opt-group">
              <h4>Color</h4>
              <div className="opt-row">
                {p.allColors.map((c) => (
                  <button key={c} type="button" className="opt" data-active={lColors.includes(c)} onClick={() => setLColors((x) => toggle(x, c))}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          {p.allSizes.length > 0 && (
            <div className="opt-group">
              <h4>Talla</h4>
              <div className="opt-row">
                {p.allSizes.map((z) => (
                  <button key={z} type="button" className="opt" data-active={lSizes.includes(z)} onClick={() => setLSizes((x) => toggle(x, z))}>
                    {z}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="opt-group">
            <h4>Rebajas</h4>
            <div className="opt-row">
              <button type="button" className="opt" data-active={lSale} onClick={() => setLSale((v) => !v)}>
                Solo rebajas
              </button>
            </div>
          </div>
        </div>
        <div className="sheet__foot">
          <button type="button" className="btn btn--ghost" onClick={clearLocal} style={{ flex: "0 0 auto" }}>
            <span>Limpiar</span>
          </button>
          <button type="button" className="btn" onClick={apply} style={{ flex: 1 }}>
            <span>Ver resultados</span>
          </button>
        </div>
      </div>
    </>
  );
}
