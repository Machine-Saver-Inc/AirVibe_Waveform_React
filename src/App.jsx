// src/App.jsx
import { useState } from "react";
import WaveformGrid from "./components/WaveformGrid.jsx";

export default function App() {
  const [count, setCount] = useState(0);
  const ver = import.meta.env.VITE_APP_VERSION || "dev";
  const built = import.meta.env.VITE_BUILD_TIME || "local";

  // mock demo data to prove the UI; we'll wire real data later
  const demo = {
    total: 36,
    received: [0,1,2,3,4,7,9,12,18,19,20,22,23,24,25,30,31,32,33],
    late:     [5,6,10,11,21],
    requested:[5,6,10],
  };

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui, sans-serif"}}>
      <div style={{textAlign:"center", display:"grid", gap:16}}>
        <h1 style={{fontSize:"3rem", marginBottom:"0.25rem"}}>AirVibe Waveform</h1>
        <p style={{opacity:0.8}}>GitHub Actions → GitHub Pages ✅</p>

        <button
          onClick={() => setCount(c => c + 1)}
          style={{padding:"0.5rem 1rem", borderRadius:12, border:"1px solid #444", cursor:"pointer", justifySelf:"center"}}
          aria-label="demo button"
        >
          Demo button (count = {count})
        </button>

        <WaveformGrid {...demo} />

        <div style={{marginTop:"0.5rem", opacity:0.7, fontSize:"0.9rem"}}>
          build <code>{ver}</code> • <code>{built}</code> UTC
        </div>
      </div>
    </main>
  );
}
