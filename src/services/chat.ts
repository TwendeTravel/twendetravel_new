// filepath: src/services/chat.ts
import { COLLECTIONS, Conversation } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { messagesService } from './messages';
import { conversationsService } from './conversations';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

const conversationService = new FirestoreService<Conversation>(COLLECTIONS.CONVERSATIONS);

export const chatService = {
  // Fetch all messages for a conversation
  async getMessages(conversationId: string) {
    try {
      return await messagesService.list(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async getConversation(id: string) {
    try {
      const conversation = await conversationService.getById(id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  async sendMessage(conversation_id: string, text: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const message = await messagesService.send({
        conversation_id,
        content: text
      });

      // Update conversation's updatedAt timestamp
      await conversationService.update(conversation_id, {
        updatedAt: firestoreHelpers.now()
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId: string, callback: (msg: any) => void) {
    return messagesService.subscribeToNewMessages(conversationId, callback);
  },

  // Subscribe to updates (e.g., status changes) on a conversation
  subscribeToConversationUpdates(conversationId: string, callback: (conv: Conversation) => void) {
    return conversationService.subscribeToDoc(conversationId, callback);
  },

  // Get or create a support conversation for the current user
  async getOrCreateSupportConversation() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      return await conversationsService.getOrCreateSupportConversation(currentUser.uid);
    } catch (error) {
      console.error('Error getting/creating support conversation:', error);
      throw error;
    }
  }
};