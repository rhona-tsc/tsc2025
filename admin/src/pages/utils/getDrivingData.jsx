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
  });

    const element = response.data?.rows?.[0]?.elements?.[0];

    if (element?.status !== 'OK') {
      throw new Error(`Google Maps error: ${element?.status}`);
    }

    const distanceInMiles = element.distance.value / 1609.34; // meters to miles
    const durationInMinutes = element.duration.value / 60; // seconds to minutes

    return {
      distance: distanceInMiles,
      duration: durationInMinutes,
    };
  } catch (error) {
    console.error('🚨 Error getting driving data:', error);
    return {
      distance: 0,
      duration: 0,
    };
  }
};