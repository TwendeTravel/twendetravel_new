
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Itinerary = Database['public']['Tables']['itineraries']['Row'];
type ItineraryInsert = Database['public']['Tables']['itineraries']['Insert'];

export const itineraryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        admin:admin_id(*),
        items:itinerary_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching itineraries",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        admin:admin_id(*),
        items:itinerary_items(
          *,
          flight_booking:flight_bookings(*),
          hotel_booking:hotel_bookings(*),
          transport_booking:transportation_bookings(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: "Error fetching itinerary",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async create(itineraryData: Omit<ItineraryInsert, 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an itinerary",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        ...itineraryData,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating itinerary",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async update(id: string, itineraryData: Partial<Itinerary>) {
    const { data, error } = await supabase
      .from('itineraries')
      .update(itineraryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating itinerary",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  }
};
