// geocode.js

import axios from 'axios';
const { REACT_APP_MAPBOX_API_KEY } = process.env;

const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
        params: {
          access_token: process.env.REACT_APP_MAPBOX_API_KEY,
          proximity: '-79.3832,43.6532', // Center search around Toronto
        },
      });
      const { data } = response;
      if (data.features.length > 0) {
        const { center } = data.features[0];
        return { longitude: center[0], latitude: center[1] };
      }
      throw new Error('No results found');
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };
  
  export default geocodeAddress;