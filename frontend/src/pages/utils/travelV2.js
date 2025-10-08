// frontend/src/pages/utils/travelV2.js
import { BACKEND } from "../../apiBase";

export async function getTravelV2(origin, destination, date) {
  const url = new URL(`${BACKEND}/api/v2/travel`);
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  if (date) url.searchParams.set("date", String(date).slice(0,10));

  const r = await fetch(url.toString(), { headers: { accept: "application/json" }, credentials: "omit" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.message || `HTTP ${r.status}`);

  const meters  = j?.outbound?.distance?.value || 0;
  const seconds = j?.outbound?.duration?.value || 0;
  return {
    outbound: j?.outbound || null,
    returnTrip: j?.returnTrip || null,
    miles: meters / 1609.34,
    minutes: seconds / 60,
    sources: j?.sources || {}
  };
}