import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, Phone, MessageCircle, Download, Star, Camera, Navigation, Utensils, Bed, Car, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';
import Loader from '@/components/Loader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TravelPatternBackground from "@/components/ui/travel-pattern-background";
import WhatsAppStyleTravelBackground from "@/components/ui/whatsapp-style-travel-background";

interface Trip {
  id: string;
  title?: string;
  destination: string;
  origin: string;
  startDate?: string;
  endDate?: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
  totalCost?: number;
  budget?: number;
  travelers?: number;
  concierge: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  images?: string[];
  documents?: string[];
}

interface ItineraryItem {
  id: string;
  date?: string;
  time: string;
  title: string;
  type: 'flight' | 'hotel' | 'activity' | 'transport' | 'meal';
  description: string;
  location?: string;
  confirmation?: string;
  confirmationNumber?: string;
  notes?: string;
  status?: string;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadTripDetails();
  }, [id]);

  const loadTripDetails = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockTrip: Trip = {
        id: id || '1',
        destination: 'Accra, Ghana',
        origin: 'New York, USA',
        start_date: '2025-09-15',
        end_date: '2025-09-22',
        status: 'upcoming',
        budget: 4500,
        travelers: 2,
        concierge: {
          name: 'Kwame Asante',
          phone: '+233-24-123-4567',
          email: 'kwame@twendetravel.com',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        }
      };

      const mockItinerary: ItineraryItem[] = [
        {
          id: '1',
          date: '2025-09-15',
          time: '08:00',
          title: 'Flight Departure',
          description: 'United Airlines UA123 - JFK to ACC',
          location: 'John F. Kennedy International Airport',
          type: 'flight',
          status: 'confirmed',
          confirmationNumber: 'UA123ABC'
        },
        {
          id: '2',
          date: '2025-09-15',
          time: '14:30',
          title: 'Airport Transfer',
          description: 'Private transfer to hotel',
          location: 'Kotoka International Airport',
          type: 'transport',
          status: 'confirmed',
          confirmationNumber: 'TRF456'
        },
        {
          id: '3',
          date: '2025-09-15',
          title: 'Hotel Check-in',
          description: 'Movenpick Ambassador Hotel - Deluxe Room',
          location: 'Independence Avenue, Accra',
          type: 'hotel',
          status: 'confirmed',
          confirmationNumber: 'MOV789',
          time: '16:00'
        },
        {
          id: '4',
          date: '2025-09-15',
          title: 'Welcome Dinner',
          description: 'Traditional Ghanaian cuisine at Buka Restaurant',
          location: 'East Legon, Accra',
          type: 'meal',
          status: 'confirmed',
          time: '19:00'
        }
      ];

      setTrip(mockTrip);
      setItinerary(mockItinerary);
    } catch (error) {
      console.error('Error loading trip details:', error);
      toast({
        title: 'Error Loading Trip',
        description: 'Unable to load trip details. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'hotel': return <Bed className="w-4 h-4" />;
      case 'transport': return <Car className="w-4 h-4" />;
      case 'meal': return <Utensils className="w-4 h-4" />;
      case 'activity': return <Camera className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const handleContactConcierge = () => {
    navigate('/chat?message=I have a question about my upcoming trip to ' + trip?.destination);
  };

  const downloadItinerary = () => {
    toast({
      title: 'Download Started',
      description: 'Your itinerary PDF will be downloaded shortly.'
    });
  };

  if (isLoading) {
    return <Loader message="Loading trip details..." />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-twende-beige via-white to-twende-skyblue/20 relative overflow-hidden flex items-center justify-center">
        <WhatsAppStyleTravelBackground opacity={0.02} />
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isUpcoming = trip.status === 'upcoming';
  const statusColor = trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-twende-beige via-white to-twende-skyblue/20 relative overflow-hidden">
      {/* Authentic WhatsApp-Style Travel Pattern Background */}
      <WhatsAppStyleTravelBackground opacity={0.03} />
      
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Button variant="ghost" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
        </Button>
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {trip.origin} → {trip.destination}
          </h1>
          <div className="flex items-center text-gray-600 mt-2 space-x-4">
            <Calendar className="h-5 w-5" />
            <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
            <Badge className={statusColor}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetails;
