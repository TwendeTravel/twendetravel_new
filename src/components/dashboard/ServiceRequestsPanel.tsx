import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceRequestService, ServiceRequestItem } from "@/services/service-requests";
import type { Service } from "@/services/service-requests";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ServiceRequestsPanelProps {
  extended?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return "bg-yellow-500";
    case 'approved': return "bg-green-500";
    case 'in-progress': return "bg-blue-500";
    case 'completed': return "bg-purple-500";
    case 'cancelled': return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export default function ServiceRequestsPanel({ extended = false }: ServiceRequestsPanelProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const data = await serviceRequestService.getUserRequests();
        setRequests(data || []);
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
        toast({
          title: "Error",
          description: "Failed to load your service requests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Load all service definitions for display
  useEffect(() => {
    serviceRequestService.getServices()
      .then((data) => setServices(data))
      .catch((err) => {
        console.error("Failed to load service definitions:", err);
        toast({ title: "Error", description: "Failed to load services", variant: "destructive" });
      });
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No service requests yet</h3>
        <p className="text-gray-500 mb-4">Create your first service request to get started with your travel plans</p>
        <Button asChild>
          <Link to="/dashboard?tab=services">
            <Plus className="mr-2 h-4 w-4" />
            New Service Request
          </Link>
        </Button>
      </div>
    );
  }

  // Display only the most recent 3 requests if not extended
  const displayedRequests = extended ? requests : requests.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayedRequests.map((request) => (
        <div key={request.id} className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-base font-semibold">{request.destination}</h3>
              <div className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {formatDate(request.start_date)} - {formatDate(request.end_date)}
              </div>
            </div>
            <Badge className={`${getStatusColor(request.status)} text-white`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Service:</span>
              <div className="ml-2 space-y-1">
                {request.items.map(({ service_id, qty }) => {
                  const svc = services.find((s) => s.id === String(service_id));
                  return (
                    <div key={service_id}>
                      {svc?.name ?? 'Unknown Service'} × {qty}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Budget:</span> ${request.budget.toLocaleString()}
            </div>
          </div>
          
          {request.special_requirements && extended && (
            <div className="mt-2 text-sm">
              <span className="text-gray-500">Notes:</span> {request.special_requirements}
            </div>
          )}
        </div>
      ))}
      
      {!extended && requests.length > 3 && (
        <div className="text-center mt-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard?tab=requests">
              View All Requests
            </Link>
          </Button>
        </div>
      )}

      <div className="text-center mt-4">
        <Button asChild>
          <Link to="/dashboard?tab=services">
            <Plus className="mr-2 h-4 w-4" />
            New Service Request
          </Link>
        </Button>
      </div>
    </div>
  );
}
