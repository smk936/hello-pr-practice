import { ProductGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="wrap" aria-busy="true">
      <header className="phead">
        <div className="sk sk-line" style={{ width: 110, height: 12 }} />
        <div className="sk sk-line" style={{ width: "58%", height: 40, marginTop: 16 }} />
      </header>
      <div style={{ height: 20 }} />
      <ProductGridSkeleton />
    </div>
  );
}
