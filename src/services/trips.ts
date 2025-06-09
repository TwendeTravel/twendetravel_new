
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Trip = Database['public']['Tables']['trips']['Row'];
type TripInsert = Database['public']['Tables']['trips']['Insert'];

export const tripService = {
  async getAll() {
    const { data, error } = await supabase
      .from('trips')
      .select('*');
    
    if (error) {
      toast({
        title: "Error fetching trips",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Trip[];
  },

  async create(tripData: Omit<TripInsert, 'user_id' | 'created_at' | 'updated_at'>) {
    // Get the current user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a trip",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('trips')
      .insert({
        ...tripData,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error creating trip",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Trip;
  },

  async update(id: string, tripData: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update(tripData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error updating trip",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Trip;
  }
};
