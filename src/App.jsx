// src/App.jsx
import { useEffect, useState } from "react";
import WaveformGrid from "./components/WaveformGrid.jsx";
import { gridFromMessage } from "./store/grid.js";

export default function App() {
  const ver = import.meta.env.VITE_APP_VERSION || "dev";
  const built = import.meta.env.VITE_BUILD_TIME || "local";

  const [grid, setGrid] = useState({ total: 0, received: [], late: [], requested: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch("/waveform-demo.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const msg = await res.json();
      setGrid(gridFromMessage(msg));
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui, sans-serif"}}>
      <div style={{textAlign:"center", display:"grid", gap:16}}>
        <h1 style={{fontSize:"3rem", marginBottom:"0.25rem"}}>AirVibe Waveform</h1>
        <p style={{opacity:0.8}}>GitHub Actions → GitHub Pages ✅</p>

        <div style={{display:"flex", gap:8, justifyContent:"center"}}>
          <button
            onClick={load}
            style={{padding:"0.5rem 1rem", borderRadius:12, border:"1px solid #444", cursor:"pointer"}}
          >
            Reload JSON
          </button>
        </div>

        {loading && <p>Loading…</p>}
        {err && <p style={{color:"#e23b3b"}}>Error: {err}</p>}
        {!loading && !err && grid.total > 0 && <WaveformGrid {...grid} />}

        <div style={{marginTop:"0.5rem", opacity:0.7, fontSize:"0.9rem"}}>
          build <code>{ver}</code> • <code>{built}</code> UTC
        </div>
      </div>
    </main>
  );
}
