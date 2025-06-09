
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type ChatMessage = Database['public']['Tables']['messages']['Row'];
export type ChatConversation = Database['public']['Tables']['conversations']['Row'];

export const chatService = {
  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new as ChatMessage)
      )
      .subscribe();
  },
  
  subscribeToConversationUpdates(conversationId: string, callback: (conversation: ChatConversation) => void) {
    return supabase
      .channel('conversation-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload) => callback(payload.new as ChatConversation)
      )
      .subscribe();
  },

  async getConversation(conversationId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      toast({
        title: "Error fetching conversation",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },
  
  async updateConversationStatus(conversationId: string, status: string) {
    const { data, error } = await supabase
      .from('conversations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating conversation",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  }
};
