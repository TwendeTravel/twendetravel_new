
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

// Sample data - in a real app, this would come from an API
const destinations = [
  {
    id: "dest-1",
    name: "Accra",
    country: "Ghana",
    image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=1600&q=80",
    coverImage: "https://images.unsplash.com/photo-1580323956505-169e32a678fe?auto=format&fit=crop&w=2000&q=80",
    bestTime: "Oct-Apr",
    timezone: "GMT+0",
    language: "English",
    currency: "Ghanaian Cedi (GHS)",
    description: "Accra is the capital city of Ghana, known for its vibrant culture, historic sites, and beautiful beaches. The city offers a blend of traditional and modern experiences, with bustling markets, museums, and a growing food scene.",
    rating: 4.8,
    fullPrice: "$299",
    discountedPrice: "$249",
    highlights: [
      "Visit the iconic Kwame Nkrumah Memorial Park",
      "Experience the vibrant Makola Market",
      "Relax at Labadi Beach",
      "Explore the National Museum of Ghana",
      "Enjoy the local cuisine at Oxford Street"
    ],
    attractions: [
      { name: "Kwame Nkrumah Memorial Park", type: "Historical", rating: 4.7 },
      { name: "Labadi Beach", type: "Beach", rating: 4.5 },
      { name: "Makola Market", type: "Shopping", rating: 4.3 },
      { name: "National Museum of Ghana", type: "Museum", rating: 4.6 },
      { name: "Jamestown Lighthouse", type: "Landmark", rating: 4.4 },
      { name: "Artists Alliance Gallery", type: "Art", rating: 4.2 }
    ],
    activities: [
      { name: "City Tour", duration: "4 hours", price: "$45", rating: 4.8 },
      { name: "Food Tasting Tour", duration: "3 hours", price: "$60", rating: 4.9 },
      { name: "Beach Day Trip", duration: "Full day", price: "$80", rating: 4.6 },
      { name: "Cultural Dance Workshop", duration: "2 hours", price: "$35", rating: 4.7 }
    ],
    amenities: [
      "Free WiFi",
      "Coffee Shops",
      "Restaurants",
      "Shopping",
      "Photography Spots",
      "Historical Landmarks"
    ],
    reviews: [
      { user: "Sarah M.", rating: 5, comment: "Loved the food and the people were so friendly!" },
      { user: "John D.", rating: 4, comment: "Great beaches and interesting history. The traffic can be challenging though." },
      { user: "Elena K.", rating: 5, comment: "An amazing blend of tradition and modernity. Will definitely return!" }
    ]
  },
  {
    id: "dest-2",
    name: "Nairobi",
    country: "Kenya",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25467bf?auto=format&fit=crop&w=600&q=80",
    bestTime: "Jun-Oct",
    rating: 4.9,
    price: "$329"
  },
  {
    id: "dest-3",
    name: "Cape Coast",
    country: "Ghana",
    image: "https://images.unsplash.com/photo-1600350972581-95a288726237?auto=format&fit=crop&w=600&q=80",
    bestTime: "Nov-Mar",
    rating: 4.6,
    price: "$249"
  }
];

const DestinationInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // In a real app, fetch data from API
    const found = destinations.find(d => d.id === id);
    setDestination(found);
    
    // Check if this destination is favorited
    const favorited = localStorage.getItem(`favorite-${id}`) === 'true';
    setIsFavorite(favorited);
  }, [id]);

  if (!destination) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twende-teal"></div>
      </div>
    );
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
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Price and booking */}
        <Card className="mb-6 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Price per person</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold text-twende-teal dark:text-twende-skyblue">
                        {destination.discountedPrice || destination.price}
                      </span>
                      {destination.fullPrice && (
                        <span className="text-gray-500 line-through">
                          {destination.fullPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Button className="bg-twende-teal hover:bg-opacity-90 text-white">
                      Book Now
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-twende-teal dark:text-twende-skyblue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Best time to visit</p>
                      <p className="font-medium">{destination.bestTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-twende-teal dark:text-twende-skyblue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Timezone</p>
                      <p className="font-medium">{destination.timezone || "GMT+0"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2 text-twende-teal dark:text-twende-skyblue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                      <p className="font-medium">{destination.language || "English"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2 text-twende-teal dark:text-twende-skyblue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                      <p className="font-medium">{destination.currency || "USD"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:hidden mt-6">
                  <Button className="w-full bg-twende-teal hover:bg-opacity-90 text-white">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full max-w-3xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="amenities" className="hidden md:block">Amenities</TabsTrigger>
            <TabsTrigger value="reviews" className="hidden md:block">Reviews</TabsTrigger>
          </TabsList>
          
          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>About {destination.name}</CardTitle>
                <CardDescription>Overview and highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {destination.description || `${destination.name} is a beautiful destination in ${destination.country}, known for its unique culture and attractions.`}
                </p>
                
                {destination.highlights && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {destination.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-twende-teal/10 text-twende-teal dark:bg-twende-skyblue/10 dark:text-twende-skyblue mr-2 text-sm">
                            {index + 1}
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attractions tab */}
          <TabsContent value="attractions" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Top Attractions</CardTitle>
                <CardDescription>Places to visit in {destination.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(destination.attractions || []).map((attraction: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{attraction.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm">{attraction.rating}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {attraction.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Activities tab */}
          <TabsContent value="activities" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Activities</CardTitle>
                <CardDescription>Experiences in {destination.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(destination.activities || []).map((activity: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{activity.name}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{activity.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-twende-teal dark:text-twende-skyblue">{activity.price}</div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm">{activity.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Amenities tab */}
          <TabsContent value="amenities" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Available Amenities</CardTitle>
                <CardDescription>Facilities and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(destination.amenities || ["Free WiFi", "Coffee Shops", "Restaurants", "Shopping", "Photography Spots", "Historical Landmarks"]).map((amenity: string, index: number) => {
                    // Choose icon based on amenity
                    let Icon = Landmark;
                    if (amenity.includes("WiFi")) Icon = Wifi;
                    else if (amenity.includes("Coffee")) Icon = Coffee;
                    else if (amenity.includes("Restaurant")) Icon = Utensils;
                    else if (amenity.includes("Shopping")) Icon = ShoppingBag;
                    else if (amenity.includes("Photography")) Icon = Camera;
                    
                    return (
                      <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Icon className="h-4 w-4 mr-2 text-twende-teal dark:text-twende-skyblue" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reviews tab */}
          <TabsContent value="reviews" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Traveler Reviews</CardTitle>
                <CardDescription>What people are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(destination.reviews || [
                    { user: "Sarah M.", rating: 5, comment: "Loved the food and the people were so friendly!" },
                    { user: "John D.", rating: 4, comment: "Great beaches and interesting history. The traffic can be challenging though." },
                    { user: "Elena K.", rating: 5, comment: "An amazing blend of tradition and modernity. Will definitely return!" }
                  ]).map((review: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-card">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{review.user}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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
    </div>
  );
};

export default DestinationInfo;
