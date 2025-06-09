
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export const bookingService = {
  async create(bookingData: Omit<BookingInsert, 'user_id' | 'created_at' | 'updated_at'>) {
    // Get the current user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a booking",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Booking;
  },

  async updateStatus(id: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Booking;
  }
};
