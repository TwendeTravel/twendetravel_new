
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import type { Database } from "@/integrations/supabase/types";

export type UserStats = Database['public']['Tables']['user_stats']['Row'];

export const userStatsService = {
  async getCurrentUserStats() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return null;

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }

    return data;
  }
};
