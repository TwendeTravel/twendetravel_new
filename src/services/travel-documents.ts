
import { toast } from "@/components/ui/use-toast";
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/temp-supabase-stubs';
import type { Database } from "@/integrations/supabase/types";

export type TravelDocument = Database['public']['Tables']['travel_documents']['Row'];
type TravelDocumentInsert = Database['public']['Tables']['travel_documents']['Insert'];

export const travelDocumentService = {
  async getCurrentUserDocuments() {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const { data, error } = await supabase
      .from('travel_documents')
      .select('*')
      .eq('user_id', currentUser.uid)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found error
      toast({
        title: "Error fetching travel documents",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async upsert(documentData: Omit<TravelDocumentInsert, 'user_id' | 'created_at' | 'updated_at'>) {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update travel documents",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('travel_documents')
      .upsert({
        ...documentData,
        user_id: currentUser.uid,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating travel documents",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  }
};
