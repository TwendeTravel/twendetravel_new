import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
// Removed duplicate Button import
import { Loader } from "@/components/Loader";
import { 
  Calendar,
  Clock,
  Plane,
  Building,
  Car,
  Check,
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
import { roleService } from '@/services/roles';
import { toast } from '@/hooks/use-toast';

export default function AdminTravelManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  // Compute requests starting in next 7 days
  const attentionRequests = serviceRequests.filter(req => {
    const today = new Date();
    const soon = new Date(today);
    soon.setDate(today.getDate() + 7);
    const sd = new Date(req.start_date);
    return sd >= today && sd <= soon;
  });
  const [travelStats, setTravelStats] = useState({
    totalItineraries: 0,
    pendingItineraries: 0,
    confirmedItineraries: 0,
    upcomingTrips: 0,
    flightsBooked: 0,
    hotelsBooked: 0,
    transportsBooked: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      // Fetch pending service requests (just request data)
      const { data: reqData, error: reqError } = await supabase
        .from('service_requests')
        .select('*')  
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (reqError) throw reqError;
      // Fetch user emails via roles view
      const roles = await roleService.getAllUserRoles();
      const enriched = (reqData || []).map(req => ({
        ...req,
        email: roles.find(r => r.user_id === req.user_id)?.email || 'Unknown'
      }));
      setServiceRequests(enriched);

      // (Removed itineraries and booking stats - not used)


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
        <Button variant="outline" asChild className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

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
        
        {/* Pending Service Requests */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Service Requests</CardTitle>
              <CardDescription>Approve to convert into trips</CardDescription>
            </CardHeader>
            <CardContent>
              {serviceRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceRequests.map(req => (
                      <TableRow key={req.id}>
                        <TableCell>{req.origin}</TableCell>
                        <TableCell>{req.destination}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{format(new Date(req.start_date), 'MMM d')} - {format(new Date(req.end_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{req.budget}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={async () => {
                            try {
                              await supabase.from('trips').insert({ user_id: req.user_id, origin: req.origin, destination: req.destination, start_date: req.start_date, end_date: req.end_date, status: 'scheduled' });
                              await supabase.from('service_requests').update({ status: 'approved' }).eq('id', req.id);
                              toast({ title: 'Request approved', variant: 'default' });
                              loadData();
                            } catch (e) {
                              console.error(e);
                              toast({ title: 'Error approving', variant: 'destructive' });
                            }
                          }}>Approve</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No pending requests</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Attention Needed: pending requests starting soon */}
        {/* Attention Needed: pending requests starting soon */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Attention Needed</CardTitle>
              <CardDescription>Service requests starting in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {attentionRequests.length > 0 ? (
                <ul className="list-disc pl-5">
                  {attentionRequests.map(req => (
                    <li key={req.id} className="mb-2">
                      {req.email}: {format(new Date(req.start_date), 'MMM d')} - {req.origin} to {req.destination}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No service requests starting soon</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
