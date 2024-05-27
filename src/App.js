import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Sidebar from './components/sidebar';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const App = ({ jsonDataArray }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [pins, setPins] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [hashtagFilter, setHashtagFilter] = useState(''); // New state for hashtag filter
  const [filteredHashtags, setFilteredHashtags] = useState([]);



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
        zoom: 14, // Adjust zoom level as needed
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

        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([longitude, latitude])
          .addTo(map);

        marker.getElement().addEventListener('mouseenter', () => {
          // You can add hover functionality here if needed
        });

        marker.getElement().addEventListener('mouseleave', () => {
          marker.remove();
        });
      });

      map.on('moveend', updatePinsWithinBounds);

      updatePinsWithinBounds();
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [jsonDataArray]);

  const fetchCoordinates = async (item) => {
    let coordinates = null;
    if (item.address && item.address !== " NA") {
      coordinates = { longitude: item.longitude, latitude: item.latitude };
    }
    return coordinates;
  };

  const updatePinsWithinBounds = async () => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();

    const pinData = await Promise.all(
      jsonDataArray.map(async (item) => {
        const coordinates = await fetchCoordinates(item);
        if (coordinates && bounds.contains([coordinates.longitude, coordinates.latitude])) {
          return { ...item, ...coordinates };
        }
        return null;
      })
    );

    const filteredPinData = pinData.filter(Boolean);
    setPins(filteredPinData);

    const hashtagCounts = {};
    filteredPinData.forEach((item) => {
      item.hashtags.forEach((tag) => {
        const hashtag = `#${tag.name}`;
        hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
      });
    });

    const filteredHashtags = Object.keys(hashtagCounts).filter(
      (hashtag) => hashtagCounts[hashtag] > 2
    );

    setFilteredHashtags(filteredHashtags);
  };

  useEffect(() => {
    const MyLoader = () => <div>Loading...</div>;
    const MyErrorComponent = () => <div>Error loading image.</div>;


    if (pins.length > 0 && mapRef.current) {
      markers.forEach((marker) => marker.remove());
      const newMarkers = pins.filter(
        (item) =>
          hashtagFilter === '' ||
          item.hashtags.some((tag) => `#${tag.name}` === hashtagFilter)
      ).map((item) => {
        const popupContent = `
          <div class="flex-container">
            <img src="${item.videoMeta.coverUrl}" alt="Cover" style="max-width:300px"/>
            <video class="popup-video" style="display:none;max-width: 300px;" controls>
              <source preload="none" src="${item.videoMeta.downloadAddr}" type="video/mp4">
            </video>
            <div>
              <h1><strong> ${item.restaurant}</strong></h1>
              <p><strong>Location:</strong> ${item.address}</p>
              <p><strong>Description:</strong> ${item.text}</p>
              <p><strong>Author:</strong> ${item.authorMeta.name}</p>
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
          const image = popupEl.querySelector('img');
          const video = popupEl.querySelector('.popup-video');

          image.addEventListener('mouseenter', () => {
            if (video.paused) {
              video.style.display = 'block';
              video.play().catch((error) => {
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

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [pins, hashtagFilter]);

    // Extract unique hashtags from jsonDataArray
    const uniqueHashtags = Array.from(
      new Set(
        pins.flatMap((item) =>
          item.hashtags.map((tag) => `#${tag.name}`)
        )
      )
    );

    


  return (
    <div>
      <Sidebar>
        <button onClick={() => setHashtagFilter('')}>Show All</button>
        {filteredHashtags.map((hashtag) => (
          <button key={hashtag} onClick={() => setHashtagFilter(hashtag)}>
            {hashtag}
          </button>
        ))}
      </Sidebar>
      <div ref={mapContainerRef} className="map-container" />
      
    </div>
  );
};

export default App;
