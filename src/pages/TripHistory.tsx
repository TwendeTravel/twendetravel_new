import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star, 
  Filter, 
  Search, 
  Download, 
  Eye,
  Plane,
  Hotel,
  Camera,
  Heart,
  Share2,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  rating?: number;
  review?: string;
  photos: string[];
  totalCost: number;
  concierge?: {
    name: string;
    avatar: string;
  };
  highlights: string[];
  accommodation: {
    name: string;
    type: string;
    rating: number;
  };
  transportation: {
    type: string;
    details: string;
  };
}

export default function TripHistory() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock trip data
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Mediterranean Adventure',
      destination: 'Santorini, Greece',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      status: 'completed',
      rating: 5,
      review: 'Absolutely incredible experience! The sunset views were breathtaking and our concierge made everything seamless.',
      photos: [
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      ],
      totalCost: 3200,
      concierge: {
        name: 'Maria Papadopoulos',
        avatar: 'https://randomuser.me/api/portraits/women/35.jpg'
      },
      highlights: ['Sunset dinner cruise', 'Private wine tasting', 'Historical tour of Akrotiri'],
      accommodation: {
        name: 'Canaves Oia Suites',
        type: 'Luxury Resort',
        rating: 5
      },
      transportation: {
        type: 'Flight + Private Transfer',
        details: 'Delta Airlines, Premium Economy'
      }
    },
    {
      id: '2',
      title: 'Tokyo Business Trip',
      destination: 'Tokyo, Japan',
      startDate: '2024-04-08',
      endDate: '2024-04-14',
      status: 'completed',
      rating: 4,
      review: 'Great business facilities and the cultural experiences arranged by our concierge were fantastic.',
      photos: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=800&q=80'
      ],
      totalCost: 2800,
      concierge: {
        name: 'Yuki Tanaka',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      highlights: ['Traditional tea ceremony', 'Tsukiji fish market tour', 'Sumo wrestling experience'],
      accommodation: {
        name: 'The Ritz-Carlton Tokyo',
        type: 'Business Hotel',
        rating: 5
      },
      transportation: {
        type: 'Flight + JR Pass',
        details: 'ANA Airlines, Business Class'
      }
    },
    {
      id: '3',
      title: 'Safari Adventure',
      destination: 'Serengeti, Tanzania',
      startDate: '2024-02-20',
      endDate: '2024-02-28',
      status: 'completed',
      rating: 5,
      review: 'Once in a lifetime experience! Saw the Big Five and the migration was spectacular.',
      photos: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80'
      ],
      totalCost: 4500,
      concierge: {
        name: 'Joseph Mwangi',
        avatar: 'https://randomuser.me/api/portraits/men/15.jpg'
      },
      highlights: ['Great Migration viewing', 'Hot air balloon safari', 'Maasai village visit'],
      accommodation: {
        name: 'Four Seasons Safari Lodge',
        type: 'Safari Lodge',
        rating: 5
      },
      transportation: {
        type: 'Flight + Safari Vehicle',
        details: 'Emirates Airlines, Game drive transfers'
      }
    },
    {
      id: '4',
      title: 'Alpine Ski Retreat',
      destination: 'St. Moritz, Switzerland',
      startDate: '2025-01-15',
      endDate: '2025-01-22',
      status: 'upcoming',
      photos: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80'
      ],
      totalCost: 3800,
      concierge: {
        name: 'Hans Mueller',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      highlights: ['Private ski lessons', 'Alpine spa treatments', 'Gourmet mountain dining'],
      accommodation: {
        name: 'Kulm Hotel St. Moritz',
        type: 'Luxury Resort',
        rating: 5
      },
      transportation: {
        type: 'Flight + Private Transfer',
        details: 'Swiss Airlines, First Class'
      }
    }
  ]);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    const matchesYear = yearFilter === 'all' || new Date(trip.startDate).getFullYear().toString() === yearFilter;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'oldest':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'cost':
        return b.totalCost - a.totalCost;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTrip = (tripId: string) => {
    navigate(`/trips/${tripId}`);
  };

  const handleDownloadItinerary = (tripId: string) => {
    toast({
      title: 'Downloading Itinerary',
      description: 'Your trip itinerary is being prepared for download.'
    });
  };

  const handleShareTrip = (tripId: string) => {
    toast({
      title: 'Share Link Copied',
      description: 'Trip share link has been copied to your clipboard.'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trip History</h1>
                <p className="text-gray-600">Relive your amazing travel experiences</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      View <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setViewMode('grid')}>
                      Grid View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setViewMode('list')}>
                      List View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search trips by destination or title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="cost">Highest Cost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Trip Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{trips.filter(t => t.status === 'completed').length}</div>
                  <div className="text-sm text-gray-600">Completed Trips</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{trips.filter(t => t.status === 'upcoming').length}</div>
                  <div className="text-sm text-gray-600">Upcoming Trips</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {trips.filter(t => t.rating).reduce((acc, t) => acc + (t.rating || 0), 0) / trips.filter(t => t.rating).length || 0}★
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${trips.reduce((acc, t) => acc + t.totalCost, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trips List/Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <img
                        src={trip.photos[0]}
                        alt={trip.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleViewTrip(trip.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadItinerary(trip.id)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download Itinerary
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareTrip(trip.id)}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Trip
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {trip.photos.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                          <Badge variant="secondary" className="text-xs">
                            <Camera className="w-3 h-3 mr-1" />
                            +{trip.photos.length - 1}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-lg mb-1">{trip.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {trip.destination}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          <span className="ml-2 text-xs">({getTripDuration(trip.startDate, trip.endDate)})</span>
                        </div>
                      </div>

                      {trip.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < trip.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{trip.rating}/5</span>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Concierge:</span>
                          <div className="flex items-center">
                            <Avatar className="w-5 h-5 mr-2">
                              <AvatarImage src={trip.concierge?.avatar} />
                              <AvatarFallback>{trip.concierge?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{trip.concierge?.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Total Cost:</span>
                          <span className="font-semibold">${trip.totalCost.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleViewTrip(trip.id)}
                        className="w-full"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={trip.photos[0]}
                          alt={trip.title}
                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-xl mb-1">{trip.title}</h3>
                              <div className="flex items-center text-gray-600 text-sm mb-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {trip.destination}
                              </div>
                              <div className="flex items-center text-gray-600 text-sm">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                <span className="ml-2">({getTripDuration(trip.startDate, trip.endDate)})</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(trip.status)}>
                                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleViewTrip(trip.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownloadItinerary(trip.id)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Itinerary
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShareTrip(trip.id)}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share Trip
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {trip.rating && (
                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < trip.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">{trip.rating}/5</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <div className="font-medium">Accommodation</div>
                              <div>{trip.accommodation.name}</div>
                              <div className="text-xs">{trip.accommodation.type}</div>
                            </div>
                            <div>
                              <div className="font-medium">Transportation</div>
                              <div>{trip.transportation.type}</div>
                              <div className="text-xs">{trip.transportation.details}</div>
                            </div>
                            <div>
                              <div className="font-medium">Total Cost</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ${trip.totalCost.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {trip.review && (
                            <div className="bg-gray-50 p-3 rounded-md mb-4">
                              <div className="text-sm text-gray-700 italic">"{trip.review}"</div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <Avatar className="w-6 h-6 mr-2">
                                  <AvatarImage src={trip.concierge?.avatar} />
                                  <AvatarFallback>{trip.concierge?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">
                                  Concierge: {trip.concierge?.name}
                                </span>
                              </div>
                              {trip.photos.length > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Camera className="w-3 h-3 mr-1" />
                                  {trip.photos.length} photos
                                </Badge>
                              )}
                            </div>

                            <Button
                              onClick={() => handleViewTrip(trip.id)}
                              variant="outline"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {sortedTrips.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || yearFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Start planning your next adventure!'}
                </p>
                <Button onClick={() => navigate('/destinations')}>
                  Explore Destinations
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
