import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const data = require('./outputs/data.json');
const axios = require('axios');
const fs = require('fs');
const REACT_APP_MAPBOX_API_KEY =""
const newData = [];

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
      params: {
        access_token: REACT_APP_MAPBOX_API_KEY,
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

const processData = async () => {
  for (const item of data) {
    let coordinates = null;

    // If address is available, use address-based geocoding
    if (item.address && item.address !== " NA") {
      coordinates = await geocodeAddress(item.address);
      if (coordinates) {
        newData.push({ ...item, ...coordinates });
      }
    }
  }
};

(async () => {
  await processData();

  try {
    fs.writeFileSync('./data_with_geocode.json', JSON.stringify(newData, null, 2));
    console.log('JSON data saved to file successfully.');
  } catch (error) {
    console.error('Error writing JSON data to file:', error);
  }
})();
