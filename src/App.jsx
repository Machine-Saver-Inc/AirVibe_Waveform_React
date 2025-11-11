// src/App.jsx
import { useEffect, useState } from "react";
import WaveformGrid from "./components/WaveformGrid.jsx";
import { gridFromMessage } from "./store/grid.js";
import { fetchMessage } from "./lib/api.js";

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

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui, sans-serif"}}>
      <div style={{textAlign:"center", display:"grid", gap:16, padding:"16px"}}>
        <h1 style={{fontSize:"3rem", marginBottom:"0.25rem"}}>AirVibe Waveform</h1>
        <p style={{opacity:0.8}}>GitHub Actions → GitHub Pages ✅</p>

        <div style={{display:"flex", gap:8, justifyContent:"center", alignItems:"center"}}>
          <label htmlFor="msg" style={{opacity:0.8}}>Message:</label>
          <select
            id="msg"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            style={{padding:"0.4rem 0.6rem", borderRadius:8, border:"1px solid #444"}}
          >
            <option value="waveform-demo.json">waveform-demo.json</option>
            <option value="waveform-demo-2.json">waveform-demo-2.json</option>
            <option value="waveform-demo-3.json">waveform-demo-3.json</option>
          </select>
          <button
            onClick={() => load(file)}
            style={{padding:"0.5rem 1rem", borderRadius:12, border:"1px solid #444", cursor:"pointer"}}
          >
            Reload
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
