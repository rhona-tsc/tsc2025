import axios from 'axios';

export const getDrivingData = async (fromPostcode, toPostcode) => {
  try {
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    const url = `${base}/api/travel/get-travel-data`;

    const { data } = await axios.get(url, {
      params: {
        origin: fromPostcode,
        destination: toPostcode,
        date: new Date().toISOString().slice(0, 10),
      },
      withCredentials: false,
      headers: { accept: "application/json" },
    });

    // handle both response shapes: { outbound } or { rows[0].elements[0] }
    const outbound = data?.outbound || data?.rows?.[0]?.elements?.[0] || {};
    const distanceMeters = outbound?.distance?.value ?? 0;
    const durationSeconds = outbound?.duration?.value ?? 0;
    const source = data?.sources?.outbound || "unknown";

    const distance = distanceMeters / 1609.34; // miles
    const duration = durationSeconds / 60;     // minutes

    return { distance, duration, distanceMeters, durationSeconds, source };
  } catch (error) {
    console.error("🚨 Error getting driving data:", error?.message || error);
    return { distance: 0, duration: 0, distanceMeters: 0, durationSeconds: 0, source: "error" };
  }
};