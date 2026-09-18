"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/commerce/types";

export function ProductGallery({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const tiles = [
    ...product.images.map((img, i) => ({
      tone: img.tone,
      label: `${String(i + 1).padStart(2, "0")} · ${img.alt}`,
    })),
    { tone: "#8C7A67", label: "vídeo · [placeholder]" },
  ];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    function onScroll() {
      if (!node || !node.clientWidth) return;
      setActive(Math.round(node.scrollLeft / node.clientWidth));
    }
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="gallery-wrap">
      <div className="gallery" ref={ref} aria-label="Galería de imágenes">
        {tiles.map((t, i) => (
          <figure className="gtile" style={{ background: t.tone }} key={i}>
            <span className="tag">{t.label}</span>
          </figure>
        ))}
      </div>
      <div className="gdots" aria-hidden="true">
        {tiles.map((_, i) => (
          <i key={i} data-on={i === active} />
        ))}
      </div>
    </div>
  );
}
