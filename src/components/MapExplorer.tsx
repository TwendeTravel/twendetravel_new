import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

// Interface for destination data
interface Destination {
  id: number;
  name: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
}

// Sample destination data
const destinations: Destination[] = [
  {
    id: 1,
    name: 'Accra',
    country: 'Ghana',
    coordinates: [-0.1870, 5.6037],
    description: 'The capital city of Ghana, known for its vibrant markets and historical sites.',
  },
  {
    id: 2,
    name: 'Cape Coast',
    country: 'Ghana',
    coordinates: [-1.2466, 5.1315],
    description: 'Home to Cape Coast Castle and beautiful beaches along the Gulf of Guinea.',
  },
  {
    id: 3,
    name: 'Kumasi',
    country: 'Ghana',
    coordinates: [-1.6132, 6.6885],
    description: 'The cultural center of the Ashanti region with traditional crafts and markets.',
  },
  {
    id: 4,
    name: 'Nairobi',
    country: 'Kenya',
    coordinates: [36.8219, -1.2921],
    description: 'Kenya\'s capital city, a gateway to safari adventures and urban experiences.',
  },
  {
    id: 5,
    name: 'Mombasa',
    country: 'Kenya',
    coordinates: [39.6682, -4.0435],
    description: 'Kenya\'s second-largest city, known for its beaches and Old Town.',
  },
  {
    id: 6,
    name: 'Maasai Mara',
    country: 'Kenya',
    coordinates: [35.0100, -1.4921],
    description: 'Famous wildlife reserve known for the Great Migration of wildebeest.',
  },
];

const MapExplorer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  // HUD state for coordinates and zoom
  const [mapState, setMapState] = useState<{ lng: number; lat: number; zoom: number }>({ lng: 18.5, lat: 1.5, zoom: 2.8 });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create MapLibre map with demo style (no token required)
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [18.5, 1.5], // Centered on Africa
      zoom: 2.8,
      projection: 'globe',
      pitch: 40,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    
    // Add markers for destinations
    destinations.forEach((destination) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'destination-marker';
      markerEl.innerHTML = `
        <div class="w-6 h-6 bg-twende-orange text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;
      
      // Add marker click event
      markerEl.addEventListener('click', () => {
        setSelectedDestination(destination);
        map.current?.flyTo({ center: destination.coordinates, zoom: 8, duration: 2000 });
      });
      
      // Add marker to map
      new maplibregl.Marker(markerEl).setLngLat(destination.coordinates).addTo(map.current!);
    });
    
    // Add atmosphere and fog for globe effect
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
      // Add DEM source and enable 3D terrain
      map.current?.addSource('dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512, maxzoom: 14 });
      map.current?.setTerrain({ source: 'dem', exaggeration: 1.5 });
      map.current?.addLayer({ id: 'sky', type: 'sky', paint: { 'sky-type': 'atmosphere', 'sky-atmosphere-sun': [0.0, 0.0], 'sky-atmosphere-sun-intensity': 15 } });
    });
    // Update HUD on map move
    map.current.on('move', () => {
      const center = map.current?.getCenter();
      const zoom = map.current?.getZoom();
      if (center && zoom != null) {
        setMapState({
          lng: +center.lng.toFixed(4),
          lat: +center.lat.toFixed(4),
          zoom: +zoom.toFixed(2),
        });
      }
    });
    
    // Cleanup on unmount
    return () => map.current?.remove();
  }, []);

  return (
    <section id="map-explorer" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center text-twende-teal dark:text-twende-skyblue">Explore Destinations</h2>
        <p className="section-subtitle text-center dark:text-gray-300">
          Discover our curated destinations in Ghana and Kenya on the interactive map
        </p>
        
        {/* Map container with 3D terrain */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 bg-gray-100 dark:bg-gray-800/30 rounded-xl overflow-hidden shadow-lg dark:shadow-none dark:border dark:border-gray-700/50 h-[600px] relative">
            <>
              <div ref={mapContainer} className="w-full h-full" />
              <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded text-sm text-gray-700 pointer-events-none">
                <div>Lat: {mapState.lat}</div>
                <div>Lng: {mapState.lng}</div>
                <div>Zoom: {mapState.zoom}</div>
              </div>
            </>
          </div>
          
          {/* Destinations List */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700/50 overflow-hidden backdrop-blur-sm">
            <div className="p-4 bg-twende-teal dark:bg-twende-skyblue/20 text-white dark:text-gray-200">
              <h3 className="text-xl font-bold">Our Destinations</h3>
              <p className="text-white/80 dark:text-gray-400">Select a destination to explore</p>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[520px] overflow-y-auto">
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedDestination?.id === destination.id ? 'bg-gray-50 dark:bg-gray-700/30' : ''
                  }`}
                  onClick={() => {
                    setSelectedDestination(destination);
                    map.current?.flyTo({
                      center: destination.coordinates,
                      zoom: 8,
                      duration: 2000,
                    });
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${destination.country === 'Ghana' ? 'bg-twende-green' : 'bg-twende-orange'} mr-3`}></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{destination.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{destination.country}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Selected Destination Info */}
        {selectedDestination && (
          <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700/50 p-6 animate-fade-in backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-twende-teal dark:text-twende-skyblue mb-2">{selectedDestination.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedDestination.country}</p>
            <p className="text-gray-700 dark:text-gray-300">{selectedDestination.description}</p>
            <button className="mt-4 btn-secondary">Explore {selectedDestination.name}</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MapExplorer;
