// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import WaveformGrid from "./components/WaveformGrid.jsx";
import MetaPanel from "./components/MetaPanel.jsx";
import { gridFromMessage } from "./store/grid.js";
import { fetchMessage } from "./lib/api.js";
import "./index.css";

// Files we support in the selector / deep links
const FILES = [
  "waveform-demo.json",
  "waveform-demo-2.json",
  "waveform-demo-3.json",
  "waveform-demo-samples.json",
];

function computeStats(grid) {
  const total = Number(grid.total || 0);
  const R = new Set(grid.received || []);
  const receivedCount = R.size;
  const missingCount = total > 0 ? total - receivedCount : 0;
  const requestedCount = new Set(grid.requested || []).size;
  const pct = total > 0 ? Math.round((receivedCount / total) * 100) : 0;
  return { total, receivedCount, missingCount, requestedCount, pct };
}

function overlayRequested(grid, extra) {
  const u = new Set([...(grid.requested || []), ...extra]);
  return { ...grid, requested: Array.from(u) };
}

function indicesMissing(grid) {
  const total = Number(grid.total || 0);
  const R = new Set(grid.received || []);
  const miss = [];
  for (let i = 0; i < total; i++) if (!R.has(i)) miss.push(i);
  return miss;
}

export default function App() {
  const ver = import.meta.env.VITE_APP_VERSION || "dev";
  const built = import.meta.env.VITE_BUILD_TIME || "local";

  // Deep link: read ?msg=<file> on first load
  const initialFile = (() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const m = q.get("msg");
      return FILES.includes(m || "") ? m : "waveform-demo.json";
    } catch {
      return "waveform-demo.json";
    }
  })();

  const [file, setFile] = useState(initialFile);
  const [msg, setMsg] = useState(null);
  const [grid, setGrid] = useState({ total: 0, received: [], late: [], requested: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Local “simulation” overlay of requested segments
  const [requestedLocal, setRequestedLocal] = useState([]);

  // Keep URL in sync with selection (no reload)
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      p.set("msg", file);
      const url = `${window.location.pathname}?${p.toString()}`;
      window.history.replaceState(null, "", url);
    } catch {}
  }, [file]);

  async function load(name = file) {
    try {
      setLoading(true);
      setErr("");
      const m = await fetchMessage(name);
      setMsg(m);
      setGrid(gridFromMessage(m));
      setRequestedLocal([]); // clear simulation on new file
    } catch (e) {
      setErr(String(e));
      setMsg(null);
      setGrid({ total: 0, received: [], late: [], requested: [] });
      setRequestedLocal([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(file); /* eslint-disable-next-line */ }, [file]);

  // Apply overlay before stats + render
  const gridOverlay = useMemo(() => overlayRequested(grid, requestedLocal), [grid, requestedLocal]);
  const s = computeStats(gridOverlay);

  // Simulate downlink “missing segments” (Port 21, mode 0 = u8 indices)
  const simulatedMissing = useMemo(() => indicesMissing(grid), [grid]);
  const simulatedDownlink = useMemo(() => {
    // Note: for demo data we stay within 0..255, so mode 0 is fine.
    return {
      port: 21,
      mode: 0,                // 0 = segments as u8 (demo)
      count: simulatedMissing.length,
      segments: simulatedMissing
    };
  }, [simulatedMissing]);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="h1">AirVibe Waveform</h1>
          <div className="muted">GitHub Actions → GitHub Pages</div>
        </div>
        <div className="row">
          <label htmlFor="msg" className="muted">Message</label>
          <select
            id="msg"
            className="select"
            value={file}
            onChange={(e) => setFile(e.target.value)}
          >
            {FILES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button className="btn" onClick={() => load(file)}>Reload</button>
        </div>
      </header>

      {/* Metadata */}
      <section className="card">
        {!loading && !err && <MetaPanel msg={msg} stats={s} />}
        {loading && <p>Loading…</p>}
        {err && <p style={{ color: "var(--danger)" }}>Error: {err}</p>}
      </section>

      {/* Stats + progress */}
      <section className="card">
        {!loading && !err && s.total > 0 && (
          <div className="stats">
            <div>
              <strong>{s.pct}%</strong> complete • received {s.receivedCount}/{s.total}
              {" • "}missing {s.missingCount}
              {" • "}requested {s.requestedCount}
            </div>
            <div className="progress">
              <div className="bar" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        )}
        {loading && <p>Loading…</p>}
        {err && <p style={{ color: "var(--danger)" }}>Error: {err}</p>}
      </section>

      {/* Controls to simulate “Request Missing Segments” */}
      <section className="card">
        <div className="row">
          <button
            className="btn"
            onClick={() => setRequestedLocal(simulatedMissing)}
            disabled={loading || !!err || simulatedMissing.length === 0}
            title="Mark all missing indices as requested (yellow)."
          >
            Request Missing (simulate)
          </button>
          <button
            className="btn"
            onClick={() => setRequestedLocal([])}
            disabled={loading || !!err || requestedLocal.length === 0}
            title="Clear simulated requests."
          >
            Clear Requests
          </button>
          <span className="muted">({simulatedMissing.length} missing)</span>
        </div>
        <pre style={{
          marginTop: 10,
          background: "#10131a",
          padding: 12,
          borderRadius: 10,
          overflowX: "auto",
          border: "1px solid var(--ring)"
        }}>
{JSON.stringify({ simulate_downlink: simulatedDownlink }, null, 2)}
        </pre>
      </section>

      {/* Grid */}
      <section className="card" style={{ display: "grid", placeItems: "center" }}>
        {!loading && !err && gridOverlay.total > 0 && <WaveformGrid {...gridOverlay} />}
      </section>

      {/* Plots */}
      <section className="card">
        {!loading && !err && (
          (() => {
            const ax1 = msg?.samplesAX1 || [];
            const ax2 = msg?.samplesAX2 || [];
            const ax3 = msg?.samplesAX3 || [];
            const any = (ax1.length + ax2.length + ax3.length) > 0;
            return any ? (
              <div className="plots">
                {ax1.length > 0 && <WaveformPlot title="Axis 1" samples={ax1} />}
                {ax2.length > 0 && <WaveformPlot title="Axis 2" samples={ax2} />}
                {ax3.length > 0 && <WaveformPlot title="Axis 3" samples={ax3} />}
              </div>
            ) : (
              <p className="muted">No sample arrays present in this message.</p>
            );
          })()
        )}
        {loading && <p>Loading…</p>}
        {err && <p style={{ color: "var(--danger)" }}>Error: {err}</p>}
      </section>

      <footer className="muted" style={{ textAlign: "center", padding: "8px 0 20px" }}>
        build <code>{ver}</code> • <code>{built}</code> UTC
      </footer>
    </div>
  );
}

// NOTE: WaveformPlot import is referenced above via dynamic block.
// If your editor complains, ensure you have:
// import WaveformPlot from "./components/WaveformPlot.jsx";
