
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

/** A chat message */
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
/** A chat conversation */
export interface ChatConversation {
  id: string;
  traveler_id: string;
  admin_id: string | null;
  status: string;
  // ...other fields
}

export const chatService = {
  // Fetch a conversation by ID
  async getConversation(conversationId: string): Promise<ChatConversation> {
    try {
      return await apiFetch<ChatConversation>(`conversations/${conversationId}`);
    } catch (error: any) {
      toast({
        title: "Error fetching conversation",
        description: error.message || 'Unable to load conversation',
        variant: "destructive",
      });
      throw error;
    }
  },

  // Fetch messages for a conversation
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      return await apiFetch<ChatMessage[]>(`conversations/${conversationId}/messages`);
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message || 'Unable to load messages',
        variant: "destructive",
      });
      throw error;
    }
  },

  // Send a new message
  async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    try {
      return await apiFetch<ChatMessage>(`conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
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
};
