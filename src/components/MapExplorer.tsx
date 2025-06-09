
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// Temporarily using a placeholder token - in production this should be handled securely
// Users should replace this with their own Mapbox token
const MAPBOX_TOKEN = 'REPLACE_WITH_YOUR_MAPBOX_TOKEN';

interface Destination {
  id: number;
  name: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  description: string;
}

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(MAPBOX_TOKEN === 'REPLACE_WITH_YOUR_MAPBOX_TOKEN');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapboxToken === 'REPLACE_WITH_YOUR_MAPBOX_TOKEN') return;

    // Set Mapbox token
    mapboxgl.accessToken = mapboxToken;
    
    // Create map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [18.5, 1.5], // Centered on Africa
      zoom: 2.8,
      projection: 'globe',
      pitch: 40,
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
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
        map.current?.flyTo({
          center: destination.coordinates,
          zoom: 8,
          duration: 2000,
        });
      });
      
      // Add marker to map
      new mapboxgl.Marker(markerEl)
        .setLngLat(destination.coordinates)
        .addTo(map.current);
    });
    
    // Add atmosphere and fog for globe effect
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });
    
    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);
  
  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById('mapbox-token') as HTMLInputElement)?.value;
    if (input) {
      setMapboxToken(input);
      setShowTokenInput(false);
    }
  };

  return (
    <section id="map-explorer" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center text-twende-teal dark:text-twende-skyblue">Explore Destinations</h2>
        <p className="section-subtitle text-center dark:text-gray-300">
          Discover our curated destinations in Ghana and Kenya on the interactive map
        </p>
        
        {/* Mapbox Token Input Form */}
        {showTokenInput && (
          <div className="max-w-xl mx-auto mb-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm dark:shadow-none dark:border dark:border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Enter your Mapbox Access Token</h3>
            <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
              To use the interactive map, please enter your Mapbox public access token. 
              You can get one by signing up at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-twende-teal dark:text-twende-skyblue underline">mapbox.com</a>.
            </p>
            <form onSubmit={handleTokenSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                id="mapbox-token"
                type="text"
                placeholder="Enter your Mapbox token"
                className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                required
              />
              <button type="submit" className="btn-primary dark:bg-twende-skyblue dark:text-black dark:hover:bg-twende-skyblue/90">
                Set Token
              </button>
            </form>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Map Container */}
          <div className="md:col-span-2 bg-gray-100 dark:bg-gray-800/30 rounded-xl overflow-hidden shadow-lg dark:shadow-none dark:border dark:border-gray-700/50 h-[600px] relative">
            {!showTokenInput ? (
              <div ref={mapContainer} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800/30">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Please enter your Mapbox token to view the map</p>
                </div>
              </div>
            )}
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
