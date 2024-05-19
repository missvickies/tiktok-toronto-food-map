import axios from 'axios';

// const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY

const searchPOI = async (query) => {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, {
      params: {
        access_token: REACT_APP_MAPBOX_API_KEY,
        types: 'poi', // Limit search results to points of interest
        limit: 1, // Limit to one result (you can adjust this as needed)
      },
    });
    

    // Extract the first result's coordinates
    const { features } = response.data;
    if (features && features.length > 0) {
      const [longitude, latitude] = features[0].center;
      return { longitude, latitude };
    } else {
      console.error('No POI found for query:', query);
      return null;
    }
  } catch (error) {
    console.error('Error searching for POI:', error);
    return null;
  }
};

export default searchPOI;
