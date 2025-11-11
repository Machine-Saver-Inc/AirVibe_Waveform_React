// src/components/WaveformPlot.jsx
export function basicStats(arr) {
  const n = arr?.length || 0;
  if (!n) return { n: 0, min: 0, max: 0, mean: 0, rms: 0, p2p: 0 };
  let min = arr[0], max = arr[0], sum = 0, sumsq = 0;
  for (const v of arr) { if (v < min) min = v; if (v > max) max = v; sum += v; sumsq += v*v; }
  const mean = sum / n;
  const rms = Math.sqrt(sumsq / n);
  return { n, min, max, mean, rms, p2p: max - min };
}

export default function WaveformPlot({ title = "Axis", samples = [], height = 140 }) {
  const n = samples?.length || 0;
  const width = 520; // will scale via viewBox
  const pad = 10;

  let min = 0, max = 1;
  if (n) {
    min = samples[0]; max = samples[0];
    for (const v of samples) { if (v < min) min = v; if (v > max) max = v; }
    if (max === min) { max = min + 1; } // avoid div-by-zero
  }

  const fx = (i) => pad + (n <= 1 ? 0 : (i / (n - 1)) * (width - 2 * pad));
  const fy = (v) => pad + (1 - (v - min) / (max - min)) * (height - 2 * pad);
  const points = n ? samples.map((v, i) => `${fx(i)},${fy(v)}`).join(" ") : "";

  const s = basicStats(samples);

  return (
    <div className="subcard">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 className="plot-title" style={{ margin: 0 }}>{title}</h3>
        <div className="muted" style={{ fontSize: 12 }}>
          n={s.n} • min={s.min} • max={s.max} • rms={s.rms.toFixed(2)}
        </div>
      </div>

      <svg className="wave" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} waveform`}>
        {/* midline */}
        {n > 0 && (
          <line
            x1={pad} x2={width - pad}
            y1={fy((min + max) / 2)} y2={fy((min + max) / 2)}
            stroke="#2a2f3a" strokeWidth="1"
          />
        )}
        {/* polyline */}
        {n > 0 && (
          <polyline
            points={points}
            fill="none"
            stroke="#00a35a"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
