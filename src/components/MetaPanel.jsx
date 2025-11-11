// src/components/MetaPanel.jsx
export default function MetaPanel({ msg, stats }) {
  const id   = msg?.transactionId ?? "—";
  const dev  = msg?.deviceEUI ?? "—";
  const sr   = msg?.sampleRateHz ?? msg?.sample_rate_hz ?? "—";
  const tot  = stats?.total ?? 0;
  const rec  = stats?.receivedCount ?? 0;
  const miss = stats?.missingCount ?? 0;
  const req  = stats?.requestedCount ?? 0;
  const pct  = stats?.pct ?? 0;

  const Item = ({ label, value }) => (
    <div className="card" style={{ padding: 12 }}>
      <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18 }}>{value}</div>
    </div>
  );

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12
    }}>
      <Item label="Transaction ID" value={id} />
      <Item label="Device EUI"     value={dev} />
      <Item label="Sample rate (Hz)" value={sr} />
      <Item label="Segments"       value={`${rec}/${tot} (${pct}%)`} />
      <Item label="Missing"        value={miss} />
      <Item label="Requested"      value={req} />
    </div>
  );
}
