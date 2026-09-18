export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="pgrid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="sk sk-frame" />
          <div className="sk sk-line" style={{ width: "40%", marginTop: 12 }} />
          <div className="sk sk-line" style={{ width: "70%", marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}
