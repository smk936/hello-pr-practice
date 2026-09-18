"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/commerce/types";

export function ProductGallery({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const tiles = [
    ...product.images.map((img) => ({ tone: img.tone, video: false })),
    { tone: "#8C7A67", video: true },
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
          <figure key={i} className={`gtile${t.video ? " gtile--video" : ""}`} style={{ background: t.tone }}>
            {t.video ? <span className="gtile__note">Vídeo · [placeholder]</span> : null}
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
