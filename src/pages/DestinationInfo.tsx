import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { destinationService, type Destination } from '@/services/destinations';
import { 
  Map, 
  Calendar, 
  Clock, 
  Sun, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star,
  Wifi,
  Coffee,
  Utensils,
  ShoppingBag,
  Camera,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DestinationInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDest = async () => {
      try {
        const data = await destinationService.getById(id!);
        setDestination(data);
        setIsFavorite(localStorage.getItem(`favorite-${id}`) === 'true');
      } catch (err) {
        console.error('Error fetching destination:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDest();
  }, [id]);

  if (isLoading || !destination) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-twende-teal"></div></div>;
  }

  const toggleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    localStorage.setItem(`favorite-${id}`, newValue.toString());
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero section with full-width image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={destination.coverImage || destination.image} 
          alt={`${destination.name}, ${destination.country}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Floating header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
              <Share2 className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Destination info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{destination.name}</h1>
          <div className="flex items-center mt-2">
            <Map className="h-4 w-4 mr-1" />
            <span>{destination.country}</span>
            <div className="flex items-center ml-4">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{destination.rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">{destination.description}</p>
        {/* Additional details can be rendered here using destination coordinates, etc. */}
      </div>
      
      {/* Similar destinations section */}
      <section className="mt-12 mb-6">
        <h2 className="text-2xl font-bold mb-6">Similar Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations
            .filter(d => d.id !== id)
            .slice(0, 3)
            .map(dest => (
              <Link to={`/destination/${dest.id}`} key={dest.id}>
                <Card className="h-full hover-lift overflow-hidden">
                  <div className="relative h-48">
                    <img 
                      src={dest.image} 
                      alt={`${dest.name}, ${dest.country}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/80 text-gray-800 hover:bg-white/90">
                        {dest.bestTime}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{dest.name}, {dest.country}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{dest.rating}</span>
                      </div>
                      <span className="font-bold text-twende-teal dark:text-twende-skyblue">{dest.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default DestinationInfo;
