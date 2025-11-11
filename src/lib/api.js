// src/lib/api.js
const BASE = (import.meta.env.VITE_API_BASE || "").trim();

function join(base, path) {
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  try {
    return new URL(path, base).toString();
  } catch {
    const b = base.endsWith("/") ? base : base + "/";
    return b + path.replace(/^\//, "");
  }
}

export async function fetchMessage(file) {
  const url = join(BASE, file);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`);
  return res.json();
}
