
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

export interface Trip {
  id: string;
  title: string;
  description: string;
  // ...other fields as defined by your backend
}
// Data shape for creating a trip (omit server-managed fields)
export type TripInsert = Omit<Trip, 'id'>;

export const tripService = {
  async getAll(): Promise<Trip[]> {
    try {
      return await apiFetch<Trip[]>('trips');
    } catch (error: any) {
      toast({
        title: "Error fetching trips",
        description: error.message || 'Unable to load trips',
        variant: "destructive",
      });
      throw error;
    }
  },

  async create(tripData: TripInsert): Promise<Trip> {
    try {
      return await apiFetch<Trip>('trips', {
        method: 'POST',
        body: JSON.stringify(tripData),
      });
    } catch (error: any) {
      toast({
        title: "Error creating trip",
        description: error.message || 'Unable to create trip',
        variant: "destructive",
      });
      throw error;
    }
  },

  async update(id: string, tripData: Partial<Trip>): Promise<Trip> {
    try {
      return await apiFetch<Trip>(`trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tripData),
      });
    } catch (error: any) {
      toast({
        title: "Error updating trip",
        description: error.message || 'Unable to update trip',
        variant: "destructive",
      });
      throw error;
    }
  }
};
