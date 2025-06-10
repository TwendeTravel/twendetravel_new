
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

/** A chat message record */
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  status: string;
  created_at: string;
  updated_at?: string;
}
/** Data to send a new chat message */
export interface MessageSendData {
  conversation_id: string;
  content: string;
}

export const messageService = {
  /** Fetch messages for a conversation */
  async getByConversationId(conversationId: string): Promise<Message[]> {
    try {
      return await apiFetch<Message[]>(`conversations/${conversationId}/messages`);
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message || 'Unable to load messages',
        variant: "destructive",
      });
      throw error;
    }
  },

  // Real-time subscriptions removed; consider WebSocket integration if needed

  /** Send a new message in a conversation */
  async send(data: MessageSendData): Promise<Message> {
    try {
      return await apiFetch<Message>(`conversations/${data.conversation_id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: data.content }),
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || 'Unable to send message',
        variant: "destructive",
      });
      throw error;
    }
  },

  /** Mark a message as read */
  async markAsRead(messageId: string): Promise<Message> {
    try {
      return await apiFetch<Message>(`messages/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'read' }),
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      return Promise.reject(error);
    }
  },
};
