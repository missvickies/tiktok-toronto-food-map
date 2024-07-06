import React, { useState, useEffect, useRef, Suspense } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import { createRoot } from 'react-dom/client';
import './App.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Sidebar from './components/sidebar';
import LoadingScreen from './components/LoadingScreen';
import VirtualizedList from './components/VirtualizedList';
import Navbar from './components/navbar'
import Chip from '@mui/material/Chip';
import SlidingCard from './components/slidingcard';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';


import { BottomNavigation, BottomNavigationAction, Button, Box, SwipeableDrawer, Typography } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import UpdateIcon from '@mui/icons-material/Update';
import { red } from '@mui/material/colors';
import { Sledding } from '@mui/icons-material';

const LazyLoadMedia = React.lazy(() => import('./components/LazyLoadMedia'));

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const App = ({ jsonDataArray }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [pins, setPins] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [hashtagFilter, setHashtagFilter] = useState('');
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const initializeMap = async () => {
      if (!jsonDataArray || jsonDataArray.length === 0) {
        return;
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.3832, 43.6532],
        zoom: 14,
        attributionControl: false
      });

      mapRef.current = map;

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        countries: "CA"
      });
      map.addControl(geocoder,"top-left")
      
      map.on('moveend', updatePinsWithinBounds);


      updatePinsWithinBounds();
      setLoading(false);
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
    if (item.address && item.address !== ' NA') {
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

  const renderRow = (item) => (
    <div key={item.id} className="marker-item">
      <Suspense fallback={<div>Loading...</div>}>
        <LazyLoadMedia item={item} />
      </Suspense>
    </div>
  );

  useEffect(() => {
    if (pins.length > 0 && mapRef.current) {
      markers.forEach((marker) => marker.remove());
      const newMarkers = pins
        .filter(
          (item) =>
            hashtagFilter === '' ||
            item.hashtags.some((tag) => `#${tag.name}` === hashtagFilter)
        )
        .map((item) => {
          const marker = new mapboxgl.Marker({
            color: selectedPin && selectedPin.id === item.id ? 'red' : 'grey'
          })
            .setLngLat([item.longitude, item.latitude])
            .addTo(mapRef.current);

          marker.getElement().addEventListener('click', () => {
            setSelectedPin(item);
            setDrawerOpen(true);
          });

          return marker;
        });

      setMarkers(newMarkers);
    }
  }, [pins, hashtagFilter, selectedPin]);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {loading && <LoadingScreen />}
        <Box sx ={{height:'30', width:'300px'}}id = "searchbar"></Box>
        <div ref={mapContainerRef} className='mapbox-container' />
        <Sidebar>
        <Paper sx={{borderRadius:16}} elevation={6} > 
          <Chip style={{ backgroundColor: 'white' }} label="show all" variant="filled" onClick={() => setHashtagFilter("")} />
          </Paper>
          {filteredHashtags.map((hashtag) => (
            <Paper sx={{borderRadius:16}} elevation={6}> 
            <Chip label={hashtag} variant="filled" key={hashtag} onClick={() => setHashtagFilter(hashtag)} style={{ backgroundColor: 'white' }} />
            </Paper>
          ))}
        </Sidebar>
        <BottomNavigation
          sx={{ position: 'relative', zIndex: 1 }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Explore" icon={<ExploreIcon />} />
          <BottomNavigationAction label="Saved" icon={<BookmarkIcon />} />
          <BottomNavigationAction label="Updates" icon={<UpdateIcon />} />
        </BottomNavigation>
        <SwipeableDrawer
          anchor="bottom"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          sx={{ zIndex: 1301 }}
        >
          <Box
            sx={{
              p: 2,
              height: '60vh',
              overflow: 'auto'
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {selectedPin && (
              <>
                <div>
                  <h1><strong>{selectedPin.restaurant}</strong></h1>
                  <p> 📍 {selectedPin.address}</p>
                  <p>{selectedPin.text}</p>
                  <p><strong>Author:</strong> {selectedPin.authorMeta.name}</p>
                  <Suspense fallback={<div>Loading...</div>}>
                    <LazyLoadMedia item={selectedPin} isOpen={drawerOpen} />
                  </Suspense>
                </div>
              </>
            )}
          </Box>
        </SwipeableDrawer>
      </Box>
  );
};

export default App;
