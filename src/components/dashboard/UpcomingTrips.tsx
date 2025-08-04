import { CalendarClock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/temp-supabase-stubs';
import { Loader } from '@/components/Loader';
import { TravelDoodles, EmptyStateIllustrations } from "@/components/ui/travel-doodles";

interface UpcomingTripsProps {
  extended?: boolean;
}

const UpcomingTrips = ({ extended = false }: UpcomingTripsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [pastTrips, setPastTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.uid)
          .order('start_date', { ascending: true });
        if (error) throw error;
        const now = new Date();
        setTrips(data.filter(t => new Date(t.start_date) >= now));
        setPastTrips(data.filter(t => new Date(t.start_date) < now));
      } catch (err) {
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {trips.length === 0 && !extended && (
        <div className="text-center py-8">
          <EmptyStateIllustrations.NoTrips className="w-20 h-20 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-2">No upcoming trips</p>
          <p className="text-xs text-gray-400">Your future adventures will appear here</p>
        </div>
      )}
      
      {trips.map((trip) => (
        <div key={trip.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors relative overflow-hidden border border-gray-200">
          <div className="absolute top-1 right-1">
            <TravelDoodles.Airplane className="w-5 h-5" color="#FF7F50" />
          </div>
          <div className="w-10 h-10 bg-twende-orange/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-twende-orange" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">
              {trip.origin} → {trip.destination}
            </h4>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Badge variant="outline">
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Badge>
              <Link to={`/trip/${trip.id}`}>
                <Button variant="ghost" size="sm">View</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {extended && (
        <>
          <h3 className="font-semibold text-lg mt-8 mb-4 text-foreground">Past Trips</h3>
          {pastTrips.length === 0 ? (
            <div className="text-center py-8">
              <EmptyStateIllustrations.NoTrips className="w-16 h-16 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No past trips yet</p>
              <p className="text-xs text-gray-400">Your travel memories will appear here</p>
            </div>
          ) : (
            pastTrips.map((trip) => (
              <div key={trip.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors opacity-80 relative overflow-hidden border border-gray-200">
                <div className="absolute top-1 right-1">
                  <TravelDoodles.Camera className="w-5 h-4" color="#4D724D" />
                </div>
                <div className="w-10 h-10 bg-twende-orange/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-twende-orange" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {trip.origin} → {trip.destination}
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline">
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                    <Link to={`/trip/${trip.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {!extended && trips.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2"
          onClick={() => navigate('/dashboard?tab=my-trips')}
        >
          View all trips
        </Button>
      )}
    </div>
  );
};

export default UpcomingTrips;
