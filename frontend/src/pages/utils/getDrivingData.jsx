import axios from 'axios';

export const getDrivingData = async (fromPostcode, toPostcode) => {
  try {
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    const response = await axios.get(`${base}/api/travel/get-travel-data`, {
      params: {
        origin: fromPostcode,
        destination: toPostcode,
        date: new Date().toISOString().slice(0,10),
      },
      // make sure we don't accidentally send cookies
      withCredentials: false,
    });

    // ⬇️ updated shape (this is what I meant)
    const outbound = response.data?.outbound;
    const distanceMeters   = outbound?.distance?.value || 0;
    const durationSeconds  = outbound?.duration?.value || 0;
    const source           = response.data?.sources?.outbound || 'unknown';

    const distance = distanceMeters / 1609.34; // miles
    const duration = durationSeconds / 60;     // minutes

    return { distance, duration, distanceMeters, durationSeconds, source };
  } catch (error) {
    console.error('🚨 Error getting driving data:', error);
    return { distance: 0, duration: 0 };
  }
};