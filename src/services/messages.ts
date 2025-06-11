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
}