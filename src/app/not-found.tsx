import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingBlock: "clamp(60px,14vh,160px)", maxWidth: 640 }}>
      <span className="eyebrow">Error 404</span>
      <h1 className="h-display" style={{ margin: "14px 0 16px" }}>
        Esta página no existe.
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Puede que la prenda se haya agotado o que el enlace haya cambiado.
      </p>
      <Link className="btn btn--ghost" href="/">
        <span>Volver a la tienda</span>
      </Link>
    </div>
  );
}
