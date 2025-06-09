
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type CallSession = Database['public']['Tables']['call_sessions']['Row'];
type CallSessionInsert = Database['public']['Tables']['call_sessions']['Insert'];

export const callSessionService = {
  async create(callData: Omit<CallSessionInsert, 'initiator_id' | 'created_at' | 'updated_at'>) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to start a call",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('call_sessions')
      .insert({
        ...callData,
        initiator_id: userId
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error starting call",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async updateStatus(sessionId: string, status: string) {
    const { data, error } = await supabase
      .from('call_sessions')
      .update({
        status,
        ...(status === 'ended' ? { end_time: new Date().toISOString() } : {})
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating call status",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  }
};
