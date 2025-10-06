import axios from 'axios';

export const getDrivingData = async (fromPostcode, toPostcode) => {
  try {
    const response = await axios.post('/api/travel/get-travel-data', {
      origin: fromPostcode,
      destination: toPostcode,
    });

    const { distance, duration, distanceMeters, durationSeconds, source } = response.data;

    const distanceInMiles = distance / 1609.34;
    const durationInMinutes = duration / 60;

    return {
      distance: distanceInMiles,
      duration: durationInMinutes,
      distanceMeters,
      durationSeconds,
      source,
    };
  } catch (error) {
    console.error('🚨 Error getting driving data:', error);
    return {
      distance: 0,
      duration: 0,
    };
  }
};