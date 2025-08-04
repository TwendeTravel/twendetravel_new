
import { toast } from "@/components/ui/use-toast";
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/temp-supabase-stubs';
import type { Database } from "@/integrations/supabase/types";

export type UserActivity = Database['public']['Tables']['user_activities']['Row'];

export const userActivityService = {
  async getCurrentUserActivities() {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', currentUser.uid)
      .order('time', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    return data;
  }
};
