// src/App.jsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const ver = import.meta.env.VITE_APP_VERSION || "dev";
  const built = import.meta.env.VITE_BUILD_TIME || "local";

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui, sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:"3rem", marginBottom:"0.5rem"}}>AirVibe Waveform</h1>
        <p style={{opacity:0.8, marginBottom:"1rem"}}>Deployed via GitHub Actions → GitHub Pages ✅</p>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{padding:"0.5rem 1rem", borderRadius:12, border:"1px solid #444", cursor:"pointer"}}
          aria-label="demo button"
        >
          Demo button (count = {count})
        </button>

        <div style={{marginTop:"1.25rem", opacity:0.7, fontSize:"0.9rem"}}>
          build <code>{ver}</code> • <code>{built}</code> UTC
        </div>
      </div>
    </main>
  );
}
