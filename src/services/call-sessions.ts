
import { toast } from "@/components/ui/use-toast";
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/temp-supabase-stubs';
import type { Database } from "@/integrations/supabase/types";

export type CallSession = Database['public']['Tables']['call_sessions']['Row'];
type CallSessionInsert = Database['public']['Tables']['call_sessions']['Insert'];

export const callSessionService = {
  async create(callData: Omit<CallSessionInsert, 'initiator_id' | 'created_at' | 'updated_at'>) {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
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
        initiator_id: currentUser.uid
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
