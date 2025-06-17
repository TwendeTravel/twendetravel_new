// filepath: src/services/messages.ts
import { supabase } from '@/lib/supabaseClient'

/**
 * Chat message record from `messages` table, including sender relation
 */
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  read: boolean;
  created_at: string;
  sender?: { id: string; email: string };
}

export const messageService = {
  async list(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },
  // Send a new message
  async send({ conversation_id, content }: { conversation_id: string; content: string }) {
    // Include sender_id for message
    const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
    if (sessErr) throw sessErr;
    const userId = sessionData.session?.user.id;
    if (!userId) throw new Error('User not authenticated');
    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id, text: content, sender_id: userId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // Subscribe to new messages in a conversation
  subscribeToNewMessages(conversationId: string, callback: (msg: any) => void) {
    return supabase
      .channel(`public:messages:conversation_id=eq.${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  },
  // Mark a message as read
  markAsRead(messageId: string) {
    return supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
  }
}