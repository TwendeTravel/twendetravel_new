
import { CalendarClock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UpcomingTripsProps {
  extended?: boolean;
}

const UpcomingTrips = ({ extended = false }: UpcomingTripsProps) => {
  // Sample data - in a real app, this would come from an API
  const trips = [
    {
      id: "trip-1",
      destination: "Accra, Ghana",
      startDate: "May 15, 2025",
      endDate: "May 25, 2025",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // Accra skyline
    },
    {
      id: "trip-2",
      destination: "Nairobi, Kenya",
      startDate: "July 10, 2025",
      endDate: "July 20, 2025",
      status: "Planning",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // Nairobi cityscape
    }
  ];

  const pastTrips = [
    {
      id: "trip-3",
      destination: "Cape Coast, Ghana",
      startDate: "February 5, 2025",
      endDate: "February 15, 2025",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1600350972581-95a288726237?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div key={trip.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
          <img 
            src={trip.image} 
            alt={trip.destination} 
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{trip.destination}</h4>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarClock className="h-3.5 w-3.5 mr-1" />
              <span>{trip.startDate} - {trip.endDate}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Badge 
                variant={trip.status === "Confirmed" ? "default" : "outline"}
                className={trip.status === "Confirmed" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {trip.status}
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
              <img 
                src={trip.image} 
                alt={trip.destination} 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{trip.destination}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                  <span>{trip.startDate} - {trip.endDate}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline">{trip.status}</Badge>
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
          onClick={() => {}}
        >
          View all trips
        </Button>
      )}
    </div>
  );
};

export default UpcomingTrips;
