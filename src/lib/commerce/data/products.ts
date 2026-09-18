// ─────────────────────────────────────────────────────────────
// SEED CATALOG — development data.
// Names, prices and tones are placeholders to make the store
// functional. Verifiable FACTS (composition, care, origin) are left
// `null` and rendered as clearly-marked placeholders in the UI.
// Replace this whole module by setting COMMERCE_PROVIDER=shopify.
// ─────────────────────────────────────────────────────────────
import type { Collection, Product } from "../types";

const EUR = "EUR";

export const COLLECTIONS: Collection[] = [
  { handle: "camisas", title: "Camisas", intro: "La que te pones sin pensar." },
  { handle: "punto", title: "Punto", intro: "Pesa lo justo. Para los días que no se deciden." },
  { handle: "sastreria", title: "Sastrería suave", intro: "Sin rigidez. También vale para el domingo." },
  { handle: "pantalones", title: "Pantalones", intro: "De la cintura al tobillo, bien resueltos." },
  { handle: "abrigos", title: "Abrigos", intro: "Lo que se pone encima de todo." },
  { handle: "novedades", title: "Novedades", intro: "Lo último que hemos hecho." },
  { handle: "rebajas", title: "Rebajas", intro: "Menos, no peor. Lo que queda, a mejor precio." },
];

interface ColorSeed { name: string; tone: string; tone2: string }
interface Seed {
  handle: string; title: string; code: string; subtitle: string;
  price: number; compareAt?: number;
  colors: ColorSeed[]; sizes: string[]; soldOut?: string[];
  collections: string[]; tags: string[]; createdAt: string;
  description: string[]; fit?: string;
}

const C = {
  piedra: { name: "Piedra", tone: "#B9A48F", tone2: "#A79079" },
  tinta: { name: "Tinta", tone: "#2A231D", tone2: "#17120E" },
  mar: { name: "Mar", tone: "#22484C", tone2: "#2E5A5E" },
  almagre: { name: "Almagre", tone: "#9A3B2B", tone2: "#7E2E22" },
  oliva: { name: "Oliva", tone: "#6F7A6A", tone2: "#545C50" },
  arena: { name: "Arena", tone: "#C2B4A2", tone2: "#B0A08C" },
} satisfies Record<string, ColorSeed>;

const TOPS = ["XS", "S", "M", "L", "XL"];
const BOTTOMS = ["36", "38", "40", "42", "44"];

const SEEDS: Seed[] = [
  {
    handle: "camisa-cuello-clasico", title: "Camisa de cuello clásico", code: "Nº 014",
    subtitle: "La prenda que abre el otoño.", price: 128,
    colors: [C.piedra, C.tinta, C.mar], sizes: TOPS, soldOut: ["Mar/XS"],
    collections: ["camisas", "novedades"], tags: ["novedad"], createdAt: "2026-09-01",
    fit: "Corte holgado, hombro relajado.",
    description: [
      "Cuello clásico, caída holgada, puño con botón.",
      "Se lleva por dentro, por fuera, o abierta sobre una camiseta.",
    ],
  },
  {
    handle: "camisa-franela", title: "Camisa de franela", code: "Nº 041",
    subtitle: "Para cuando baja la temperatura.", price: 118,
    colors: [C.oliva, C.almagre, C.tinta], sizes: TOPS,
    collections: ["camisas", "novedades"], tags: ["novedad"], createdAt: "2026-09-08",
    fit: "Regular, cae recto.",
    description: [
      "Tejido con cuerpo, cuello camisero, botonadura sencilla.",
      "La camisa que también hace de chaqueta ligera.",
    ],
  },
  {
    handle: "jersey-canale", title: "Jersey de canalé", code: "Nº 007",
    subtitle: "El que te pones sin pensar.", price: 142,
    colors: [C.almagre, C.oliva, C.tinta], sizes: TOPS, soldOut: ["Oliva/L", "Oliva/XL"],
    collections: ["punto"], tags: [], createdAt: "2026-08-20",
    fit: "Ajustado al cuerpo, cuello redondo.",
    description: [
      "Punto cerrado, canalé fino, cuerpo recto.",
      "Cuando baja la temperatura y no quieres pensar.",
    ],
  },
  {
    handle: "jersey-cuello-alto", title: "Jersey de cuello alto", code: "Nº 033",
    subtitle: "El fondo del invierno.", price: 138,
    colors: [C.arena, C.mar, C.tinta], sizes: TOPS,
    collections: ["punto", "novedades"], tags: ["novedad"], createdAt: "2026-09-10",
    fit: "Ceñido, cuello vuelto.",
    description: [
      "Cuello alto que se dobla, punto medio, mangas largas.",
      "Debajo de una chaqueta o solo. Aguanta el día.",
    ],
  },
  {
    handle: "pantalon-pinza", title: "Pantalón de pinza", code: "Nº 021",
    subtitle: "De la cintura al tobillo, resuelto.", price: 164,
    colors: [C.tinta, C.piedra, C.oliva], sizes: BOTTOMS,
    collections: ["pantalones", "sastreria"], tags: [], createdAt: "2026-08-14",
    fit: "Talle medio, pierna recta.",
    description: [
      "Pinza delantera, pierna recta, largo al tobillo.",
      "Se lleva con camisa por dentro o con punto por fuera.",
    ],
  },
  {
    handle: "chaqueta-sastre", title: "Chaqueta sastre suave", code: "Nº 028",
    subtitle: "Sastrería sin rigidez.", price: 268,
    colors: [C.tinta, C.arena], sizes: TOPS,
    collections: ["sastreria", "novedades"], tags: ["novedad"], createdAt: "2026-09-05",
    fit: "Estructura ligera, hombro natural.",
    description: [
      "Solapa media, dos botones, sin hombreras rígidas.",
      "Chaqueta que también vale para el domingo.",
    ],
  },
  {
    handle: "abrigo-solapa-ancha", title: "Abrigo de solapa ancha", code: "Nº 040",
    subtitle: "Lo que se pone encima de todo.", price: 312,
    colors: [C.piedra, C.tinta], sizes: TOPS,
    collections: ["abrigos"], tags: [], createdAt: "2026-08-28",
    fit: "Largo, oversize contenido.",
    description: [
      "Solapa ancha, largo por debajo de la rodilla, dos bolsillos.",
      "El abrigo que cierra cualquier conjunto.",
    ],
  },
  {
    handle: "gabardina-algodon", title: "Gabardina de algodón", code: "Nº 009",
    subtitle: "Entretiempo, resuelto.", price: 174, compareAt: 248,
    colors: [C.arena, C.tinta], sizes: TOPS, soldOut: ["Tinta/XL"],
    collections: ["abrigos", "rebajas"], tags: [], createdAt: "2026-06-30",
    fit: "Recta, cinturón opcional.",
    description: [
      "Cuello camisero, botonadura sencilla, cinturón que puedes quitar.",
      "Para la lluvia fina y los días que no se deciden.",
    ],
  },
];

function build(s: Seed): Product {
  const variants = s.colors.flatMap((c) =>
    s.sizes.map((sz) => ({
      id: `${s.handle}--${c.name.toLowerCase()}--${sz.toLowerCase()}`,
      sku: `${s.code.replace(/\D/g, "")}-${c.name.slice(0, 2).toUpperCase()}-${sz}`,
      title: `${c.name} / ${sz}`,
      options: [
        { name: "Color", value: c.name },
        { name: "Talla", value: sz },
      ],
      price: { amount: s.price, currencyCode: EUR },
      compareAtPrice: s.compareAt ? { amount: s.compareAt, currencyCode: EUR } : null,
      available: !(s.soldOut ?? []).includes(`${c.name}/${sz}`),
      inventory: null,
    })),
  );

  return {
    id: s.handle,
    handle: s.handle,
    title: s.title,
    code: s.code,
    subtitle: s.subtitle,
    description: s.description,
    options: [
      { name: "Color", values: s.colors.map((c) => c.name) },
      { name: "Talla", values: s.sizes },
    ],
    variants,
    images: s.colors.map((c) => ({ tone: c.tone, alt: `${s.title} — ${c.name}` })),
    card: { a: s.colors[0].tone, b: s.colors[0].tone2 },
    price: { amount: s.price, currencyCode: EUR },
    compareAtPrice: s.compareAt ? { amount: s.compareAt, currencyCode: EUR } : null,
    tags: s.tags,
    collectionHandles: s.collections,
    details: { composition: null, care: null, origin: null, fit: s.fit ?? null, modelNote: null },
    seo: { title: `${s.title} · CENIT`, description: s.subtitle },
    createdAt: s.createdAt,
  };
}

export const PRODUCTS: Product[] = SEEDS.map(build);
