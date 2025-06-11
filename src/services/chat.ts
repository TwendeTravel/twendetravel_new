// filepath: src/services/chat.ts
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/ui/use-toast'

export const chatService = {
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
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id, text })
    if (error) throw error
    return data
  },
}