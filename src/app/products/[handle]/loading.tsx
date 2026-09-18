export default function Loading() {
  return (
    <div className="wrap" aria-busy="true">
      <div className="pdp" style={{ paddingTop: 20 }}>
        <div className="sk sk-frame" />
        <div>
          <div className="sk sk-line" style={{ width: "45%", height: 28 }} />
          <div className="sk sk-line" style={{ width: "30%", height: 18, marginTop: 14 }} />
          <div className="sk sk-line" style={{ width: "100%", height: 46, marginTop: 26 }} />
          <div className="sk sk-line" style={{ width: "100%", height: 46, marginTop: 10 }} />
        </div>
      </div>
    </div>
  );
}
