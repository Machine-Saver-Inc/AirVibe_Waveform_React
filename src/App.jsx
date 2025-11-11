// src/App.jsx
import { useEffect, useState } from "react";
import WaveformGrid from "./components/WaveformGrid.jsx";
import { gridFromMessage } from "./store/grid.js";
import { fetchMessage } from "./lib/api.js";
import "./index.css";

function computeStats(grid) {
  const total = Number(grid.total || 0);
  const R = new Set(grid.received || []);
  const receivedCount = R.size;
  const missingCount = total > 0 ? total - receivedCount : 0;
  const requestedCount = (grid.requested || []).length;
  const pct = total > 0 ? Math.round((receivedCount / total) * 100) : 0;
  return { total, receivedCount, missingCount, requestedCount, pct };
}

export default function App() {
  const ver = import.meta.env.VITE_APP_VERSION || "dev";
  const built = import.meta.env.VITE_BUILD_TIME || "local";

  const [file, setFile] = useState("waveform-demo.json");
  const [grid, setGrid] = useState({ total: 0, received: [], late: [], requested: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load(name = file) {
    try {
      setLoading(true);
      setErr("");
      const msg = await fetchMessage(name);
      setGrid(gridFromMessage(msg));
    } catch (e) {
      setErr(String(e));
      setGrid({ total: 0, received: [], late: [], requested: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(file); }, [file]);

  const s = computeStats(grid);

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
            <option value="waveform-demo.json">waveform-demo.json</option>
            <option value="waveform-demo-2.json">waveform-demo-2.json</option>
            <option value="waveform-demo-3.json">waveform-demo-3.json</option>
          </select>
          <button className="btn" onClick={() => load(file)}>Reload</button>
        </div>
      </header>

      <section className="card">
        {loading && <p>Loading…</p>}
        {err && <p style={{ color: "var(--danger)" }}>Error: {err}</p>}

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
      </section>

      <section className="card" style={{ display: "grid", placeItems: "center" }}>
        {!loading && !err && grid.total > 0 && <WaveformGrid {...grid} />}
      </section>

      <footer className="muted" style={{ textAlign: "center", padding: "8px 0 20px" }}>
        build <code>{ver}</code> • <code>{built}</code> UTC
      </footer>
    </div>
  );
}
