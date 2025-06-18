
import { useState } from 'react';
import { Heart } from 'lucide-react';

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  rating: number;
  // price prop removed, use dynamic pricing when available
  popular: string[];
  delay?: number;
}

const DestinationCard = ({
  name,
  country,
  image,
  rating,
  price,
  popular,
  delay = 0
}: DestinationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80";

  const handleImageError = () => {
    console.log(`Image failed to load: ${image}`);
    setImageError(true);
  };

  return (
    <div
      className="card hover-lift overflow-hidden group animate-slide-up dark:bg-gray-800/50 dark:border dark:border-gray-700 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageError ? fallbackImage : image}
          alt={`${name}, ${country}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={handleImageError}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Like Button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors duration-300 dark:bg-black/40 dark:hover:bg-black/60">
          <Heart className="w-4 h-4 text-white" />
        </button>

        {/* Country Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-twende-teal text-white dark:bg-twende-skyblue dark:text-black">
            {country}
          </span>
        </div>
        
        {/* Destination Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white">{name}</h3>
        </div>
      </div>
      
      {/* Card Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          {/* Rating */}
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
          </div>
          
        {/* Price display removed; implement dynamic pricing if needed */}
        </div>
        
        {/* Popular For */}
        <p className="text-sm text-gray-600 truncate dark:text-gray-400">
          <span className="font-medium dark:text-gray-300">Popular for:</span> {popular.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default DestinationCard;
