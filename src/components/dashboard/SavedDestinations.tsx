
import { useState } from "react";
import { Heart, MapPin, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SavedDestinationsProps {
  extended?: boolean;
}

const SavedDestinations = ({ extended = false }: SavedDestinationsProps) => {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([
    {
      id: "dest-1",
      name: "Accra",
      country: "Ghana",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // Accra skyline
      bestTime: "Oct-Apr",
      saved: true
    },
    {
      id: "dest-2",
      name: "Nairobi",
      country: "Kenya",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // Nairobi cityscape
      bestTime: "Jun-Oct",
      saved: true
    },
    {
      id: "dest-3",
      name: "Cape Coast",
      country: "Ghana",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", // Cape Coast Castle
      bestTime: "Nov-Mar",
      saved: true
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  // If not extended, show only first 2 destinations
  const displayDestinations = extended ? destinations : destinations.slice(0, 2);
  
  const handleUnsaveDestination = async (destinationId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('saved_destinations')
        .delete()
        .eq('destination_id', destinationId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setDestinations(destinations.filter(dest => dest.id !== destinationId));
      
      toast({
        title: "Destination removed",
        description: "This destination has been removed from your saved list",
      });
    } catch (error) {
      console.error('Error removing saved destination:', error);
      toast({
        title: "Error",
        description: "Could not remove the destination. Please try again.",
        variant: "destructive",
      });
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
            onClick={() => handleUnsaveDestination(destination.id)}
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
              <span>Best time: {destination.bestTime}</span>
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
