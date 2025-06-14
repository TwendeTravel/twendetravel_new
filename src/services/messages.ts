// filepath: src/services/messages.ts
import { supabase } from '@/lib/supabaseClient'

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
    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id, text: content }])
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