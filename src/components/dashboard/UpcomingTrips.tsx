import { CalendarClock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Loader } from '@/components/Loader';

interface UpcomingTripsProps {
  extended?: boolean;
}

const UpcomingTrips = ({ extended = false }: UpcomingTripsProps) => {
  const { user } = useAuth();
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
          .eq('user_id', user.id)
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
      {trips.map((trip) => (
        <div key={trip.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
          <MapPin className="w-8 h-8 text-twende-orange" />
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
          {pastTrips.map((trip) => (
            <div key={trip.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors opacity-80">
              <MapPin className="w-8 h-8 text-twende-orange" />
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
        </>
      )}

      {!extended && trips.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2"
          onClick={() => { }}
        >
          View all trips
        </Button>
      )}
    </div>
  );
};

export default UpcomingTrips;
