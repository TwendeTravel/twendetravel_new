
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

/** Booking record returned by API */
export interface Booking {
  id: string;
  trip_id: string;
  user_id: string;
  status: string;
  // ...other fields from backend
}
/** Data for creating a booking */
export type BookingInsert = Omit<Booking, 'id'>;

export const bookingService = {
  async create(bookingData: BookingInsert): Promise<Booking> {
    try {
      return await apiFetch<Booking>('bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    } catch (error: any) {
      toast({
        title: "Error creating booking",
        description: error.message || 'Unable to create booking',
        variant: "destructive",
      });
      throw error;
    }
  },

  async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    try {
      return await apiFetch<Booking>(`bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message || 'Unable to update booking',
        variant: "destructive",
      });
      throw error;
    }
  }
};
