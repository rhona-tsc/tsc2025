// Simple in-memory cache to avoid repeated server calls while browsing in admin
const travelCache = {};
import axios from 'axios';

// Admin helper: always call backend cache-first endpoint
export const getTravelData = async (origin, destination, date) => {
  const cacheKey = `${String(origin).toUpperCase()}-${String(destination).toUpperCase()}`;
  if (travelCache[cacheKey]) {
    console.log('📦 (memory) Returning cached travel data for', origin, '→', destination);
    return travelCache[cacheKey];
  }

  try {
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    const url = `${base}/api/travel/get-travel-data`;
    const today = date || new Date().toISOString().split('T')[0];

    const res = await axios.get(url, { params: { origin, destination, date: today } });
    const data = res?.data;

    // 🔒 If the backend accidentally returned HTML or empty response, handle it safely
    if (!data || typeof data !== "object" || data.html || data.includes) {
      console.warn("⚠️ Invalid travel data response:", data);
      return null;
    }

    // Pull source info for debugging
    const srcOut = data?.sources?.outbound || 'unknown';
    const srcRet = data?.sources?.return || 'unknown';
    console.log(`🧭 Admin travel fetch [out:${srcOut} ret:${srcRet}]`, origin, '→', destination);

    // Normalize to a clean format expected by admin
    const normalized = {
      outbound: data?.outbound || null,
      returnTrip: data?.returnTrip || null,
      distanceText: data?.outbound?.distance
        ? `${(data.outbound.distance.value / 1609.34).toFixed(1)} mi`
        : '0 mi',
      distanceValue: data?.outbound?.distance?.value || 0,
      durationText: data?.outbound?.duration
        ? `${Math.round((data.outbound.duration.value || 0) / 60)} mins`
        : '0 mins',
      durationValue: data?.outbound?.duration?.value || 0,
      _source: srcOut,
    };

    travelCache[cacheKey] = normalized;
    return normalized;
  } catch (error) {
    // 🚨 Handle 404s or failed JSON parsing gracefully
    if (error.response?.status === 404) {
      console.warn('⚠️ Travel endpoint not found at', error.config?.url);
    } else {
      console.error('❌ Error fetching travel data from backend:', error?.message || error);
    }
    return null;
  }
};