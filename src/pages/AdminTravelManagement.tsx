import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { TravelerAssignments } from '@/components/admin/TravelerAssignments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { 
  Calendar,
  Clock,
  Plane,
  Building,
  Car,
  Check,
  AlertCircle,
  ShoppingBag,
  Users,
  Map
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';

export default function AdminTravelManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [travelStats, setTravelStats] = useState({
    totalItineraries: 0,
    pendingItineraries: 0,
    confirmedItineraries: 0,
    upcomingTrips: 0,
    flightsBooked: 0,
    hotelsBooked: 0,
    transportsBooked: 0
  });
  const [needAttentionStats, setNeedAttentionStats] = useState<{ expired_passports: number; unassigned_travelers: number }>({ expired_passports: 0, unassigned_travelers: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      // Load itineraries assigned to this admin
      const { data: itinerariesData, error: itinerariesError } = await supabase
        .from('itineraries')
        .select(`
          *,
          user:user_id(email),
          items:id(
            itinerary_items(count)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (itinerariesError) throw itinerariesError;
      setItineraries(itinerariesData || []);

      // Get upcoming trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select(`
          *,
          user:user_id(email),
          destination:destination_id(name, country, image)
        `)
        .gt('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);

      if (tripsError) throw tripsError;
      setUpcomingTrips(tripsData || []);

      // Calculate travel statistics
      const { data: statsData, error: statsError } = await supabase
        .from('itineraries')
        .select('status, id')
        .limit(1000);

      if (statsError) throw statsError;

      // Flight bookings count
      const { count: flightCount, error: flightError } = await supabase
        .from('flight_bookings')
        .select('*', { count: 'exact', head: true });

      if (flightError) throw flightError;

      // Hotel bookings count
      const { count: hotelCount, error: hotelError } = await supabase
        .from('hotel_bookings')
        .select('*', { count: 'exact', head: true });

      if (hotelError) throw hotelError;

      // Transport bookings count
      const { count: transportCount, error: transportError } = await supabase
        .from('transportation_bookings')
        .select('*', { count: 'exact', head: true });

      if (transportError) throw transportError;

      // Upcoming trips count
      const { count: upcomingCount, error: upcomingError } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .gt('start_date', new Date().toISOString());

      if (upcomingError) throw upcomingError;

      setTravelStats({
        totalItineraries: statsData?.length || 0,
        pendingItineraries: statsData?.filter(i => i.status === 'draft' || i.status === 'in_progress').length || 0,
        confirmedItineraries: statsData?.filter(i => i.status === 'confirmed').length || 0,
        upcomingTrips: upcomingCount || 0,
        flightsBooked: flightCount || 0,
        hotelsBooked: hotelCount || 0,
        transportsBooked: transportCount || 0
      });

      // Fetch need-attention stats
      const { data: needStatsData, error: needStatsError } = await supabase
        .from('user_stats')
        .select('expired_passports,unassigned_travelers')
        .single();
      if (needStatsError) throw needStatsError;
      setNeedAttentionStats(needStatsData || { expired_passports: 0, unassigned_travelers: 0 });

    } catch (err) {
      console.error("Error loading admin travel data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-96">
            <Loader size="lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Map className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">Travel Management</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{travelStats.upcomingTrips}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Itineraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{travelStats.pendingItineraries}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmed Itineraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">{travelStats.confirmedItineraries}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">
                  {travelStats.flightsBooked + travelStats.hotelsBooked + travelStats.transportsBooked}
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Plane className="h-3 w-3 mr-1" /> {travelStats.flightsBooked}
                </div>
                <div className="flex items-center">
                  <Building className="h-3 w-3 mr-1" /> {travelStats.hotelsBooked}
                </div>
                <div className="flex items-center">
                  <Car className="h-3 w-3 mr-1" /> {travelStats.transportsBooked}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin-Traveler Assignments */}
        <TravelerAssignments />
        
        <div className="mt-8">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="itineraries">Recent Itineraries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Trips</CardTitle>
                  <CardDescription>Schedule of upcoming traveler journeys</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingTrips.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Destination</TableHead>
                          <TableHead>Traveler</TableHead>
                          <TableHead>Date Range</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingTrips.map((trip) => (
                          <TableRow key={trip.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                  <img 
                                    src={trip.destination?.image || "/placeholder.svg"} 
                                    alt={trip.destination?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{trip.destination?.name}</div>
                                  <div className="text-sm text-muted-foreground">{trip.destination?.country}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                {trip.user?.email || "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(trip.status)}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/trip/${trip.id}`}>View Details</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming trips found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="itineraries">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Itineraries</CardTitle>
                  <CardDescription>Latest travel plans and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {itineraries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Traveler</TableHead>
                          <TableHead>Date Range</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itineraries.map((itinerary) => (
                          <TableRow key={itinerary.id}>
                            <TableCell className="font-medium">{itinerary.title}</TableCell>
                            <TableCell>{itinerary.user?.email || "Unknown"}</TableCell>
                            <TableCell>
                              {format(new Date(itinerary.start_date), "MMM d")} - 
                              {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(itinerary.status)}
                            </TableCell>
                            <TableCell>
                              {itinerary.items?.[0]?.itinerary_items?.[0]?.count || 0} items
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No itineraries found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Need attention alerts */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Need Attention</h2>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Expired Passport Alert</AlertTitle>
              <AlertDescription>
                {needAttentionStats.expired_passports} travelers have passports expiring in the next 60 days. <Button variant="link" className="p-0 h-auto">View details</Button>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unassigned Travelers</AlertTitle>
              <AlertDescription>
                {needAttentionStats.unassigned_travelers} travelers are not assigned to any admin. <Button variant="link" className="p-0 h-auto">Assign now</Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  );
}
