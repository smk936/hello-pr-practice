export default function Loading() {
  return (
    <div className="wrap" aria-busy="true">
      <header className="phead">
        <div className="sk sk-line" style={{ width: 90, height: 12 }} />
        <div className="sk sk-line" style={{ width: "50%", height: 40, marginTop: 16 }} />
      </header>
    </div>
  );
}
