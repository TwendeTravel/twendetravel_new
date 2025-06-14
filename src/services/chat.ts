// filepath: src/services/chat.ts
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/ui/use-toast'

export const chatService = {
  // Fetch all messages for a conversation
  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  async getConversation(id: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },
  async sendMessage(conversation_id: string, text: string) {
    // Retrieve authenticated user
    const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
    if (sessErr) throw sessErr;
    const userId = sessionData.session?.user.id;
    if (!userId) throw new Error('User not authenticated');
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, text, sender_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId: string, callback: (msg: any) => void) {
    return supabase
      .channel(`public:messages:conversation_id=eq.${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}`
      }, payload => callback(payload.new))
      .subscribe();
  },
  // Subscribe to updates (e.g., status changes) on a conversation
  subscribeToConversationUpdates(conversationId: string, callback: (conv: any) => void) {
    return supabase
      .channel(`public:conversations:id=eq.${conversationId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${conversationId}`
      }, payload => callback(payload.new))
      .subscribe();
  },
}