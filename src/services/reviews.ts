
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export const reviewService = {
  async getByDestination(destinationId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('destination_id', destinationId);
    
    if (error) {
      toast({
        title: "Error fetching reviews",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Review[];
  },

  async create(reviewData: Omit<ReviewInsert, 'user_id' | 'created_at' | 'updated_at' | 'id'>) {
    // Get the current user ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a review",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...reviewData,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error creating review",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as Review;
  }
};
