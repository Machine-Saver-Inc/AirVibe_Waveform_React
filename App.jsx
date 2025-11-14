// src/App.jsx
import React, { useState } from "react";
import Setup from "./pages/Setup.jsx";
import Live from "./pages/Live.jsx";

export default function App() {
  const [tab, setTab] = useState("setup"); // default to Setup for first-run

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>AirVibe Waveform</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setTab("setup")}>Setup</button>
        <button onClick={() => setTab("live")}>Live</button>
      </div>
      {tab === "setup" ? <Setup /> : <Live />}
    </div>
  );
}
