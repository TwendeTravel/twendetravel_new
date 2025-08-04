
import { useState, useEffect } from "react";
import { Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useSavedDestinations } from "@/hooks/useSavedDestinations";
import { destinationsService, Destination } from "@/services/destinations";

interface SavedDestinationsProps {
  extended?: boolean;
}

const SavedDestinations = ({ extended = false }: SavedDestinationsProps) => {
  const { savedIds, unsave } = useSavedDestinations();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // If not extended, show only first 2 destinations
  const displayDestinations = extended ? destinations : destinations.slice(0, 2);
  
  const handleUnsave = async (destinationId: string) => {
    setIsLoading(true);
    try {
      await unsave(destinationId);
      setDestinations(prev => prev.filter(d => d.id !== destinationId));
      toast({ title: "Removed", description: "Destination unsaved" });
    } catch {
      toast({ title: "Error", description: "Unsave failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (!savedIds.length) {
        setDestinations([]);
        setIsLoading(false);
        return;
      }
      try {
        const items = await Promise.all(savedIds.map(id => destinationsService.getById(id)));
        setDestinations(items);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [savedIds]);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {displayDestinations.map((destination) => (
        <motion.div 
          key={destination.id} 
          className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border dark:border-gray-700"
          variants={item}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img 
            src={destination.image} 
            alt={`${destination.name}, ${destination.country}`}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Button 
            variant="ghost" 
            size="icon"
            disabled={isLoading}
            onClick={() => handleUnsave(destination.id)}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-500 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
          >
            <Heart className="h-4 w-4 fill-current" />
          </Button>
          <div className="p-3">
            <h4 className="font-semibold dark:text-white">
              {destination.name}, {destination.country}
            </h4>
            <div className="flex items-center text-sm text-gray-500 mt-1 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Rating: {destination.rating}</span>
            </div>
            <div className="flex justify-end mt-2">
              <Link to={`/destination/${destination.id}`}>
                <Button variant="ghost" size="sm">Explore</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
      
      {!extended && destinations.length > 2 && (
        <motion.div
          className="col-span-full mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            to="/dashboard?tab=saved" 
            className="flex items-center justify-center text-sm text-twende-teal hover:underline dark:text-twende-skyblue"
          >
            View all saved destinations
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SavedDestinations;
