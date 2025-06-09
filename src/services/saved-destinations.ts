import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type SavedDestination = Database['public']['Tables']['saved_destinations']['Row'];
type SavedDestinationInsert = Database['public']['Tables']['saved_destinations']['Insert'];

export const savedDestinationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('saved_destinations')
      .select('*');
    
    if (error) {
      toast({
        title: "Error fetching saved destinations",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data as SavedDestination[];
  },

  async toggleSave(destinationId: string) {
    const { data: existing } = await supabase
      .from('saved_destinations')
      .select()
      .eq('destination_id', destinationId)
      .maybeSingle();
    
    if (existing) {
      const { error } = await supabase
        .from('saved_destinations')
        .delete()
        .eq('destination_id', destinationId);
      
      if (error) {
        toast({
          title: "Error removing from saved",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return null;
    } else {
      const { data, error } = await supabase
        .from('saved_destinations')
        .insert([{ destination_id: destinationId } as any])
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error saving destination",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as SavedDestination;
    }
  }
};
