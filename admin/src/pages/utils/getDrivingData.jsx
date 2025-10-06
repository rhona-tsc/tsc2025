import axios from 'axios';

export const getDrivingData = async (fromPostcode, toPostcode) => {
  try {
    const response = await axios.get('//api/travel/get-travel-data', {
      params: {
        origins: fromPostcode,
        destinations: toPostcode,
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