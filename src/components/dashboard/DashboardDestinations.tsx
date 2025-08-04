import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Heart, ExternalLink, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedDestinations } from '@/hooks/useSavedDestinations';
import { destinationsService, type Destination } from '@/services/destinations';
import { Loader } from '@/components/Loader';
import { toast } from '@/components/ui/use-toast';
import { TravelDoodles, EmptyStateIllustrations } from '@/components/ui/travel-doodles';

const DashboardDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const { savedIds, save, unsave } = useSavedDestinations();
  const navigate = useNavigate();

  const filters = ['All', 'Ghana', 'Kenya', 'Trending', 'Beach', 'Safari', 'Saved'];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await destinationsService.getAll();
        setDestinations(data);
      } catch (error: any) {
        console.error('Error fetching destinations:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load destinations. Please try again.",
        });
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
    if (activeFilter === 'Saved' && savedIds.includes(dest.id)) return true;
    return false;
  });

  const handleToggleSave = (destinationId: string) => {
    if (savedIds.includes(destinationId)) {
      unsave(destinationId);
      toast({
        title: "Removed from saved",
        description: "Destination removed from your saved list.",
      });
    } else {
      save(destinationId);
      toast({
        title: "Saved successfully",
        description: "Destination added to your saved list.",
      });
    }
  };

  const handleViewDestination = (destinationId: string) => {
    navigate(`/destination/${destinationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Browse Destinations</h2>
          <p className="text-muted-foreground">
            Discover incredible places in Ghana and Kenya hand-picked by our travel experts
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/destinations')}
          className="flex items-center gap-2"
        >
          <ExternalLink size={16} />
          View All
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={activeFilter === filter ? "bg-twende-teal hover:bg-twende-teal/90" : ""}
          >
            <Filter size={14} className="mr-1" />
            {filter}
            {filter === 'Saved' && savedIds.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {savedIds.length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDestinations.slice(0, 6).map((destination, index) => {
            const isSaved = savedIds.includes(destination.id);
            return (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-1 left-1 z-10">
                    <TravelDoodles.PalmTree className="w-4 h-6" color="#4D724D" />
                  </div>
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute top-2 right-2 p-1 rounded-full ${
                        isSaved 
                          ? 'text-red-500 bg-white/90 hover:bg-white' 
                          : 'text-gray-600 bg-white/70 hover:bg-white/90'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(destination.id);
                      }}
                    >
                      <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{destination.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin size={14} />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {destination.popular.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-twende-teal hover:bg-twende-teal/90"
                      onClick={() => handleViewDestination(destination.id)}
                    >
                      Explore Destination
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <EmptyStateIllustrations.NoDestinations className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-4">
              {activeFilter === 'Saved' 
                ? "You haven't saved any destinations yet. Start exploring and save your favorites!"
                : "No destinations match the selected filter."
              }
            </p>
            {activeFilter !== 'All' && (
              <Button variant="outline" onClick={() => setActiveFilter('All')}>
                Show All Destinations
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-1 right-1">
            <TravelDoodles.Globe className="w-5 h-5" color="#1A5F7A" />
          </div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-twende-teal">{destinations.length}</div>
            <div className="text-sm text-muted-foreground">Total Destinations</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-1 right-1">
            <TravelDoodles.Map className="w-5 h-4" color="#EF4444" />
          </div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-twende-teal">{savedIds.length}</div>
            <div className="text-sm text-muted-foreground">Saved Destinations</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-1 right-1">
            <TravelDoodles.Elephant className="w-6 h-5" color="#4D724D" />
          </div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-twende-teal">
              {destinations.filter(d => d.country === 'Ghana').length}
            </div>
            <div className="text-sm text-muted-foreground">Ghana Destinations</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-1 right-1">
            <TravelDoodles.Mountain className="w-6 h-4" color="#FF7F50" />
          </div>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-twende-teal">
              {destinations.filter(d => d.country === 'Kenya').length}
            </div>
            <div className="text-sm text-muted-foreground">Kenya Destinations</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardDestinations;
