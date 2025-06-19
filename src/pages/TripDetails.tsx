import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Badge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Loader } from "@/components/Loader";
import { supabase } from "@/lib/supabaseClient";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setTrip(data);
      } catch (err) {
        console.error('Error fetching trip:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchTrip();
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
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
