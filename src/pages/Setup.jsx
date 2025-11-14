// src/pages/Setup.jsx
import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

const copy = async (text) => {
  await navigator.clipboard.writeText(text);
  alert("Copied!");
};

export default function Setup() {
  const [fields, setFields] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ADMIN_TOKEN") || "");
  const [cn, setCn] = useState(`actility-connector-${Date.now()}`);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API}/public/actility/fields`);
      const json = await res.json();
      setFields(json);
    })();
  }, []);

  const saveToken = () => {
    localStorage.setItem("ADMIN_TOKEN", token);
    alert("Saved admin token locally.");
  };

  const genConnector = async () => {
    if (!token) return alert("Set admin token first.");
    const url = `${API}/admin/pki/issue-connector?cn=${encodeURIComponent(cn)}`;
    const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return alert(`Error: ${res.status}`);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `connector-creds-${cn}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadServerCA = async () => {
    if (!token) return alert("Set admin token first.");
    const res = await fetch(`${API}/admin/pki/server-ca`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return alert(`Error: ${res.status}`);
    const disp = res.headers.get("Content-Disposition") || "attachment; filename=server_ca.crt";
    const filename = disp.split("filename=")[1]?.replace(/"/g, "") || "server_ca.crt";
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!fields) return <div>Loading…</div>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Actility Connector Parameters</h2>
        <Item label="Hostname" value={fields.hostname} onCopy={() => copy(fields.hostname)} />
        <Item label="Protocol" value={fields.protocol} onCopy={() => copy(fields.protocol)} />
        <Item label="Published Topic" value={fields.publish} onCopy={() => copy(fields.publish)} />
        <Item label="Subscribed Topic" value={fields.subscribe} onCopy={() => copy(fields.subscribe)} />
        <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
          Cert mode: <b>{fields.cert_mode}</b> · Server CA available: <b>{fields.server_ca_available ? "yes" : "no"}</b>
        </div>
      </section>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Admin Token</h2>
        <p>Enter the admin token configured on the Edge API (<code>ADMIN_TOKEN</code>).</p>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="paste token" style={{ width: "100%" }} />
        <div style={{ marginTop: 8 }}>
          <button onClick={saveToken}>Save token locally</button>
        </div>
      </section>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Generate Connector Credentials</h2>
        <p>Common Name (CN) for the connector certificate:</p>
        <input value={cn} onChange={(e) => setCn(e.target.value)} style={{ width: "100%" }} />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={genConnector}>Generate & Download ZIP</button>
          <button onClick={downloadServerCA}>Download Server CA / Chain</button>
        </div>
        <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
          ZIP contains <code>client.crt</code>, <code>client_pkcs8.key</code>, <code>ca.crt</code>. In <b>private</b> mode it also includes
          <code> server_ca.crt</code> for Actility’s “CA Certificate” field.
        </p>
      </section>
    </div>
  );
}

function Item({ label, value, onCopy }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 8, alignItems: "center" }}>
      <div style={{ color: "#333" }}>{label}</div>
      <code style={{ background: "#f5f5f5", padding: "6px 8px", borderRadius: 6, wordBreak: "break-all" }}>{value}</code>
      <button onClick={onCopy}>Copy</button>
    </div>
  );
}
