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

  const dot = (i) => {
    let color = "#999";     // pending
    let label = "pending";
    if (R.has(i)) { color = "#00a35a"; label = "received"; }
    if (L.has(i)) { color = "#e23b3b"; label = "late/missing"; }   // overrides received
    if (Q.has(i)) { color = "#e0a800"; label = "requested"; }      // highest priority
    return { color, label };
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 40px)`,
          gap: 8,
          justifyContent: "center",
        }}
      >
        {items.map((i) => {
          const { color, label } = dot(i);
          return (
            <div
              key={i}
              title={`${i} • ${label}`}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `3px solid ${color}`,
                display: "grid",
                placeItems: "center",
                fontSize: "0.8rem",
                userSelect: "none",
              }}
            >
              {i}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", opacity: 0.8 }}>
        {[
          ["#00a35a", "received"],
          ["#e23b3b", "late/missing"],
          ["#e0a800", "requested"],
          ["#999", "pending"],
        ].map(([c, t]) => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `3px solid ${c}`,
                display: "inline-block",
              }}
              aria-hidden
            />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
