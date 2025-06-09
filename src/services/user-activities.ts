
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type UserActivity = Database['public']['Tables']['user_activities']['Row'];

export const userActivityService = {
  async getCurrentUserActivities() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return [];

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('time', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    return data;
  }
};
