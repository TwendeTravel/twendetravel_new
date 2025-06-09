
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Map, 
  Briefcase,
  Hotel,
  Plane,
  Car,
  CreditCard,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Loader } from "@/components/Loader";

// Sample data - in a real app, this would come from an API
const SAMPLE_TRIPS = [
  {
    id: "trip-1",
    name: "Accra Exploration",
    destination: "Accra, Ghana",
    startDate: "2023-11-15",
    endDate: "2023-11-22",
    status: "completed",
    image: "https://images.unsplash.com/photo-1580323956505-169e32a678fe?auto=format&fit=crop&w=1200&q=80",
    totalCost: "$1,450",
    paymentStatus: "Paid",
    accommodation: {
      name: "Kempinski Hotel Gold Coast City",
      address: "Ministries, Gamel Abdul Nasser Ave, Accra",
      checkIn: "Nov 15, 2023",
      checkOut: "Nov 22, 2023",
      price: "$120/night",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Gym"]
    },
    flights: [
      {
        airline: "Ghana Airways",
        flightNumber: "GA1234",
        departureAirport: "JFK",
        departureTime: "Nov 14, 2023, 10:45 PM",
        arrivalAirport: "ACC",
        arrivalTime: "Nov 15, 2023, 2:30 PM",
        status: "Completed",
        class: "Economy"
      },
      {
        airline: "Ghana Airways",
        flightNumber: "GA1235",
        departureAirport: "ACC",
        departureTime: "Nov 22, 2023, 4:15 PM",
        arrivalAirport: "JFK",
        arrivalTime: "Nov 22, 2023, 11:30 PM",
        status: "Completed",
        class: "Economy"
      }
    ],
    activities: [
      {
        name: "Kwame Nkrumah Memorial Park Tour",
        date: "Nov 16, 2023",
        time: "10:00 AM - 1:00 PM",
        price: "$45",
        location: "Central Accra",
        status: "Completed"
      },
      {
        name: "Labadi Beach Day",
        date: "Nov 17, 2023",
        time: "11:00 AM - 4:00 PM",
        price: "$30",
        location: "Labadi Beach",
        status: "Completed"
      },
      {
        name: "Makola Market Shopping Tour",
        date: "Nov 18, 2023",
        time: "9:00 AM - 2:00 PM",
        price: "$55",
        location: "Makola Market",
        status: "Completed"
      }
    ],
    documents: [
      { name: "Flight Tickets", type: "PDF" },
      { name: "Hotel Reservation", type: "PDF" },
      { name: "Activity Confirmations", type: "PDF" },
      { name: "Travel Insurance", type: "PDF" }
    ]
  },
  {
    id: "trip-2",
    name: "Safari Adventure",
    destination: "Maasai Mara, Kenya",
    startDate: "2023-12-10",
    endDate: "2023-12-18",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1200&q=80",
    totalCost: "$2,850",
    paymentStatus: "Partially Paid",
    accommodation: {
      name: "Maasai Mara Serena Safari Lodge",
      address: "Maasai Mara National Reserve, Kenya",
      checkIn: "Dec 10, 2023",
      checkOut: "Dec 18, 2023",
      price: "$285/night",
      image: "https://images.unsplash.com/photo-1611145440561-72df2d367637?auto=format&fit=crop&w=800&q=80",
      amenities: ["Safari View", "Swimming Pool", "Restaurant", "WiFi", "Game Drives"]
    },
    flights: [
      {
        airline: "Kenya Airways",
        flightNumber: "KA2267",
        departureAirport: "JFK",
        departureTime: "Dec 9, 2023, 11:30 PM",
        arrivalAirport: "NBO",
        arrivalTime: "Dec 10, 2023, 8:15 PM",
        status: "Confirmed",
        class: "Business"
      },
      {
        airline: "Kenya Airways",
        flightNumber: "KA2268",
        departureAirport: "NBO",
        departureTime: "Dec 18, 2023, 11:00 PM",
        arrivalAirport: "JFK",
        arrivalTime: "Dec 19, 2023, 6:30 AM",
        status: "Confirmed",
        class: "Business"
      }
    ],
    activities: [
      {
        name: "Morning Game Drive",
        date: "Dec 11-17, 2023",
        time: "6:00 AM - 10:00 AM",
        price: "Included",
        location: "Maasai Mara Reserve",
        status: "Confirmed"
      },
      {
        name: "Evening Game Drive",
        date: "Dec 11-17, 2023",
        time: "4:00 PM - 7:00 PM",
        price: "Included",
        location: "Maasai Mara Reserve",
        status: "Confirmed"
      },
      {
        name: "Hot Air Balloon Safari",
        date: "Dec 14, 2023",
        time: "5:30 AM - 9:30 AM",
        price: "$450",
        location: "Maasai Mara Reserve",
        status: "Confirmed"
      },
      {
        name: "Maasai Village Visit",
        date: "Dec 15, 2023",
        time: "2:00 PM - 5:00 PM",
        price: "$65",
        location: "Local Maasai Village",
        status: "Confirmed"
      }
    ],
    documents: [
      { name: "Flight Tickets", type: "PDF" },
      { name: "Lodge Reservation", type: "PDF" },
      { name: "Travel Insurance", type: "PDF" },
      { name: "Safari Itinerary", type: "PDF" },
      { name: "Visa Documents", type: "PDF" }
    ]
  }
];

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch trip data from API
    setIsLoading(true);
    setTimeout(() => {
      const tripData = SAMPLE_TRIPS.find(t => t.id === id);
      setTrip(tripData);
      setIsLoading(false);
    }, 800); // Simulate loading
  }, [id]);

  if (isLoading) {
    return <Loader message="Loading trip details..." />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
  const paymentStatusColor = 
    trip.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
    trip.paymentStatus === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' : 
    'bg-red-100 text-red-800';

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      {/* Hero section with trip image */}
      <div className="relative h-[30vh] overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        {/* Trip info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">{trip.name}</h1>
            <div className="flex flex-wrap items-center mt-2 gap-4">
              <div className="flex items-center">
                <Map className="h-4 w-4 mr-1" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
              <Badge className={`${statusColor} ml-auto`}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                  <CardDescription>Overview of your {trip.destination} trip</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800">Trip Timeline</h3>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-twende-teal flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{formatDate(trip.startDate)}</p>
                            <p className="text-sm text-gray-500">Trip Start</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-twende-orange flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{formatDate(trip.endDate)}</p>
                            <p className="text-sm text-gray-500">Trip End</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800">Trip Duration</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Total Days</span>
                          <span className="font-medium">
                            {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Total Activities</span>
                          <span className="font-medium">{trip.activities.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Accommodation</span>
                          <span className="font-medium">{trip.accommodation.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Trip Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {trip.activities.slice(0, 3).map((activity: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{activity.name}</p>
                          <p className="text-sm text-gray-500">{activity.date}, {activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-twende-teal">{trip.totalCost}</span>
                    <Badge className={`${paymentStatusColor} ml-2`}>
                      {trip.paymentStatus}
                    </Badge>
                  </div>
                  
                  {trip.paymentStatus === "Partially Paid" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>75% paid</span>
                        <span>$2,137.50 / $2,850</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <Button className="w-full mt-2">Complete Payment</Button>
                    </div>
                  )}
                  
                  {trip.paymentStatus === "Paid" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center bg-green-50 text-green-700 p-2 rounded-md">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span className="text-sm">Payment completed</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Accommodation tab */}
          <TabsContent value="accommodation" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Your Accommodation</CardTitle>
                <CardDescription>Details about your stay at {trip.accommodation.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={trip.accommodation.image} 
                      alt={trip.accommodation.name} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-semibold">{trip.accommodation.name}</h3>
                      <p className="text-gray-700">{trip.accommodation.address}</p>
                      <div className="flex items-center text-gray-600">
                        <Hotel className="h-4 w-4 mr-1" />
                        <span>{trip.accommodation.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="font-medium">{trip.accommodation.checkIn}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p className="font-medium">{trip.accommodation.checkOut}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {trip.accommodation.amenities.map((amenity: string, index: number) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="h-2 w-2 bg-twende-teal rounded-full mr-2"></div>
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {isUpcoming && (
                      <div className="pt-4">
                        <Button className="w-full">Modify Reservation</Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Flights tab */}
          <TabsContent value="flights" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Your Flights</CardTitle>
                <CardDescription>Flight information for your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trip.flights.map((flight: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-twende-teal mr-2" />
                          <span className="font-medium">{flight.airline}</span>
                        </div>
                        <Badge variant="outline">{flight.class}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-xl font-bold">{flight.departureAirport}</p>
                          <p className="text-sm text-gray-500">Departure</p>
                        </div>
                        
                        <div className="flex-1 mx-4">
                          <div className="relative flex items-center">
                            <div className="h-1 flex-1 bg-gray-300"></div>
                            <div className="absolute w-full flex justify-center">
                              <Badge variant="outline" className="bg-white">
                                {flight.flightNumber}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-xl font-bold">{flight.arrivalAirport}</p>
                          <p className="text-sm text-gray-500">Arrival</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between text-sm">
                        <p>{flight.departureTime}</p>
                        <p>{flight.arrivalTime}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <Badge className={
                          flight.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          flight.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {flight.status}
                        </Badge>
                        
                        {isUpcoming && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Boarding Pass
                          </Button>
                        )}
                      </div>
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
                <CardTitle>Trip Activities</CardTitle>
                <CardDescription>Activities scheduled for your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trip.activities.map((activity: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="font-medium">{activity.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{activity.date}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{activity.time}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Map className="h-3.5 w-3.5 mr-1" />
                              <span>{activity.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 md:mt-0 md:text-right">
                          <div className="font-medium text-twende-teal">{activity.price}</div>
                          <Badge className={
                            activity.status === 'Completed' ? 'bg-green-100 text-green-800 mt-2' : 
                            activity.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 mt-2' : 
                            'bg-yellow-100 text-yellow-800 mt-2'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {isUpcoming && activity.status === 'Confirmed' && (
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm">Modify</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documents tab */}
          <TabsContent value="documents" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Trip Documents</CardTitle>
                <CardDescription>Important documents for your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trip.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Download className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TripDetails;
