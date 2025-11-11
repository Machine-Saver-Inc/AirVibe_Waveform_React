// src/components/WaveformGrid.jsx
export default function WaveformGrid({
  total = 24,
  received = [],
  requested = [],
  late = [],
}) {
  const R = new Set(received);
  const Q = new Set(requested);
  const L = new Set(late);

  const cols = Math.ceil(Math.sqrt(total));
  const items = Array.from({ length: total }, (_, i) => i);

  const stateFor = (i) => {
    if (Q.has(i)) return "requested";
    if (L.has(i)) return "late";
    if (R.has(i)) return "received";
    return "pending";
  };

  return (
    <div className="wave-grid" style={{ gridTemplateColumns: `repeat(${cols}, 44px)` }}>
      {items.map((i) => (
        <div
          key={i}
          className="dot"
          data-state={stateFor(i)}
          title={`${i} • ${stateFor(i)}`}
        >
          {i}
        </div>
      ))}

      <div className="legend" style={{ gridColumn: `1 / -1`, marginTop: 6 }}>
        <span><i className="swatch received" /> received</span>
        <span><i className="swatch late" /> late/missing</span>
        <span><i className="swatch requested" /> requested</span>
        <span><i className="swatch pending" /> pending</span>
      </div>
    </div>
  );
}
