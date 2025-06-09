
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

export type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export const messageService = {
  async getByConversationId(conversationId: string) {
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

  subscribeToNewMessages(conversationId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },

  async send(message: Omit<MessageInsert, 'sender_id' | 'created_at' | 'updated_at' | 'status'>) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    // Update the conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', message.conversation_id);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        sender_id: userId,
        status: 'sent'
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data;
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('Error marking message as read:', error);
      return null;
    }

    return data;
  }
};
