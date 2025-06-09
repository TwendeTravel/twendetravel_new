
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Experience = Database['public']['Tables']['experiences']['Row'];
type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];

export const experienceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching experiences",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  }
};
