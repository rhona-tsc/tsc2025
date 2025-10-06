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
    const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '') || '';
    const url = `${base}/api/travel/get-travel-data`;
    const today = date || new Date().toISOString().split('T')[0];
    const { data } = await axios.get(url, { params: { origin, destination, date: today } });

    const srcOut = data?.sources?.outbound || 'unknown';
    const srcRet = data?.sources?.return || 'unknown';
    console.log(`🧭 Admin travel fetch [out:${srcOut} ret:${srcRet}]`, origin, '→', destination);

    // Normalize to a simple one-way shape for admin callers + keep legs
    const normalized = {
      outbound: data?.outbound,
      returnTrip: data?.returnTrip,
      distanceText: data?.outbound?.distance ? `${(data.outbound.distance.value / 1609.34).toFixed(1)} mi` : '0 mi',
      distanceValue: data?.outbound?.distance?.value || 0,
      durationText: data?.outbound?.duration ? `${Math.round((data.outbound.duration.value || 0) / 60)} mins` : '0 mins',
      durationValue: data?.outbound?.duration?.value || 0,
      _source: srcOut,
    };

    travelCache[cacheKey] = normalized;
    return normalized;
  } catch (error) {
    console.error('Error fetching travel data from backend:', error?.message || error);
    return null;
  }
};