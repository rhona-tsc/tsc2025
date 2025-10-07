import axios from 'axios';

export const getDrivingData = async (fromPostcode, toPostcode) => {
  try {
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    const url = `${base}/api/travel/get-travel-data`;
    const date = new Date().toISOString().slice(0, 10);

    const response = await axios.get(url, {
      params: { origin: fromPostcode, destination: toPostcode, date },
      headers: { accept: "application/json" },
    });

    const data = response?.data;

    if (!data || typeof data !== "object") {
      console.warn("⚠️ Invalid travel data response:", data);
      return { distance: 0, duration: 0 };
    }

    // Handle both new and old response formats
    let distanceMeters =
      data?.outbound?.distance?.value ??
      data?.rows?.[0]?.elements?.[0]?.distance?.value ??
      0;
    let durationSeconds =
      data?.outbound?.duration?.value ??
      data?.rows?.[0]?.elements?.[0]?.duration?.value ??
      0;

    const distanceInMiles = distanceMeters / 1609.34;
    const durationInMinutes = durationSeconds / 60;

    console.log(`🧭 Travel data fetched: ${distanceInMiles.toFixed(1)} mi, ${durationInMinutes.toFixed(0)} mins`);

    return {
      distance: distanceInMiles,
      duration: durationInMinutes,
    };
  } catch (error) {
    console.error('🚨 Error getting driving data:', error?.message || error);
    return {
      distance: 0,
      duration: 0,
    };
  }
};