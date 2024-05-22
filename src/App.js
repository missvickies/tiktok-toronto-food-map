import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
// import geocodeAddress from './geocode'; // Assuming you have defined this function
// import searchPOI from './searchPOI'; // Import the searchPOI function from the appropriate module
import './App.css';
import { Img } from 'react-image';

// const { REACT_APP_MAPBOX_API_KEY } = process.env;
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import geocodeAddress from './geocode';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY
const App = ({ jsonDataArray }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [pins, setPins] = useState([]);
  const [value, setValue] = React.useState('');


  useEffect(() => {
    const initializeMap = async () => {
      // Ensure jsonDataArray is available before initializing the map
      if (!jsonDataArray || jsonDataArray.length === 0) {
        return;
      }

      // Initialize the map centered on the GTA
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.3832, 43.6532], // GTA coordinates
        zoom: 12, // Adjust zoom level as needed
      });

      mapRef.current = map;

      // Add search bar (Mapbox Geocoder)
     const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false, // Do not add a marker automatically
    });

    // Add geocoder to map
    map.addControl(geocoder);

    geocoder.on('result', (event) => {
      const { result } = event;
      const [longitude, latitude] = result.center;

      const marker = new mapboxgl.Marker({"color":"red"})
        .setLngLat([longitude, latitude])
        .addTo(map);

        marker.getElement().addEventListener('mouseenter', () => {
          
        });

        marker.getElement().addEventListener('mouseleave', () => {
          marker.remove()
        });
      });


      // Fetch coordinates for each item and set pins
      const fetchCoordinatesAndSetPins = async () => {
        const pinData = await Promise.all(jsonDataArray.map(async (item) => {
          // if(item.address == " NA" && item.restaurant){console.log(item.restaurant)}
          const coordinates = await fetchCoordinates(item);
          if (coordinates) {
            return { ...item, ...coordinates };
          }
          return null;
        }));

        setPins(pinData.filter(Boolean));
      };

      fetchCoordinatesAndSetPins();
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [jsonDataArray]);

  const fetchCoordinates = async (item) => {
    // Implement combined geolocation process here
    let coordinates = null;

    // If address is available, use address-based geocoding
    if (item.address && item.address !== " NA") {
      // console.log(item.restaurant,coordinates)
      coordinates = {longitude:item.longitude , latitude:item.latitude};

    } 
    // else if (item.restaurant !== " NA" && item.address === " NA") {
    //   // If address is not available but restaurant name is provided,
    //   // perform a point-of-interest (POI) search
    //   // console.log("POI" ,item.restaurant)
    //   coordinates = await searchPOI(item.restaurant);
    // }

    return coordinates;
  };

  useEffect(() => {
    const MyLoader = () => <div>Loading...</div>;
    const MyErrorComponent = () => <div>Error loading image.</div>;

    if (pins.length > 0 && mapRef.current) {
      pins.forEach((item) => {
        const popupContent = `
          <div class="flex-container">
          <Img
                src="${item.videoMeta.coverUrl}"
                loader=${<MyLoader />}
                unloader=${<MyErrorComponent />}
                alt="Cover" class="popup-image" style="max-width: 300px;"
            />
            <video class="popup-video" style="display:none;max-width: 300px;" controls>
              <source preload="none" src="${item.videoMeta.downloadAddr}" type="video/mp4">
            </video>
            <div>
              <p><strong>Search Query:</strong> ${item.searchQuery}</p>
              <p><strong>Author:</strong> ${item.authorMeta.name}</p>
              <p><strong>Description:</strong> ${item.text}</p>
              <p><strong>Hashtags:</strong> ${item.hashtags.map(tag => '#' + tag.name).join(' ')}</p>
              <p><strong>Restaurant:</strong> ${item.restaurant}</p>
              <p><strong>Location:</strong> ${item.address}</p>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

        const marker = new mapboxgl.Marker()
          .setLngLat([item.longitude, item.latitude])
          .setPopup(popup)
          .addTo(mapRef.current);

        marker.getElement().addEventListener('click', () => {
          popup.addTo(mapRef.current);
          const popupEl = document.querySelector('.mapboxgl-popup-content');
          const image = popupEl.querySelector('.popup-image');
          const video = popupEl.querySelector('.popup-video');
          video.load()

          image.addEventListener('mouseenter', () => {
            if (video.paused) {
              video.style.display = 'block';
              video.play().catch(error => {
                console.error('Error playing video:', error);
              });
              image.style.display = 'none';
            }
          });

          video.addEventListener('mouseleave', () => {
            if (!video.paused) {
              video.pause();
              video.style.display = 'none';
              image.style.display = 'block';
            }
          });
        });
      });
    }
  }, [pins]);


  return <div>
      <div ref={mapContainerRef} className="map-container" value={value}/>
    </div>;
};

export default App;
