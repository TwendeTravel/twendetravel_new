import { useState, useEffect } from 'react';
import DestinationCard from './DestinationCard';
import { useSavedDestinations } from '@/hooks/useSavedDestinations';
import { Loader } from './Loader';
import { toast } from '@/components/ui/use-toast';
import { destinationsService, type Destination } from '@/services/destinations';
import { useNavigate } from 'react-router-dom';

const Destinations = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const filters = ['All', 'Ghana', 'Kenya', 'Trending', 'Beach', 'Safari'];
  
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await destinationsService.getAll();
        setDestinations(data);
      } catch (err: any) {
        console.error('Error fetching destinations:', err);
        setError(err.message || 'Failed to load destinations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Ghana' && dest.country === 'Ghana') return true;
    if (activeFilter === 'Kenya' && dest.country === 'Kenya') return true;
    if (activeFilter === 'Beach' && dest.popular.includes('Beach')) return true;
    if (activeFilter === 'Safari' && dest.popular.includes('Safari')) return true;
    if (activeFilter === 'Trending' && dest.rating >= 4.8) return true;
    return false;
  });

  // load save state and handlers
  const { savedIds, save, unsave } = useSavedDestinations();
  const navigate = useNavigate();
  return (
    <section id="destinations" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center dark:text-twende-skyblue">Popular Destinations</h2>
        <p className="section-subtitle text-center dark:text-gray-400">
          Discover incredible places in Ghana and Kenya hand-picked by our travel experts
        </p>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-twende-teal text-white dark:bg-twende-skyblue dark:text-gray-900'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 dark:text-red-400 my-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-twende-teal dark:text-twende-skyblue underline"
            >
              Try again
            </button>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center my-20">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {/* Destination Grid */}
            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredDestinations.map((destination, index) => {
                  const isSaved = savedIds.includes(destination.id);
                  return (
                    <DestinationCard
                      key={destination.id}
                      id={destination.id}
                      name={destination.name}
                      country={destination.country}
                      image={destination.image}
                      rating={destination.rating}
                      popular={destination.popular}
                      delay={index * 100}
                      isSaved={isSaved}
                      onToggleSave={() => isSaved ? unsave(destination.id) : save(destination.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center my-20">
                <p className="text-gray-600 dark:text-gray-400">No destinations found for the selected filter.</p>
              </div>
            )}
          </>
        )}
        
        {/* View All Button */}
        {!isLoading && filteredDestinations.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/destinations')}
              className="btn-primary dark:bg-twende-skyblue dark:text-black dark:hover:bg-twende-skyblue/90"
            >
              Explore All Destinations
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Destinations;
