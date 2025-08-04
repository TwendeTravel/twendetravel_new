// filepath: src/services/messages.ts
import { COLLECTIONS, Message, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const messageService = new FirestoreService<Message>(COLLECTIONS.MESSAGES);

/**
 * Chat message record with sender information
 */
export interface ChatMessage extends Message {
  sender?: { id: string; email: string };
}

export const messagesService = {
  firestoreService: messageService,

  async list(conversationId: string): Promise<ChatMessage[]> {
    try {
      // Fetch messages for this conversation
      const messages = await messageService.getWithQuery([
        firestoreHelpers.where('conversationId', '==', conversationId),
        firestoreHelpers.orderBy('createdAt', 'asc')
      ]);

      // For now, return without sender details as we'd need to query users collection
      // This can be enhanced later by joining with users collection
      return messages.map(msg => ({
        ...msg,
        sender: {
          id: msg.senderId,
          email: '' // TODO: Fetch from users collection if needed
        }
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a new message
  async send({ conversation_id, content }: { conversation_id: string; content: string }) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const message = await messageService.create({
        conversationId: conversation_id,
        senderId: currentUser.uid,
        content: content,
        status: 'sent',
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Subscribe to new messages in a conversation
  subscribeToNewMessages(conversationId: string, callback: (msg: Message) => void) {
    return messageService.subscribeToCollection(
      (messages) => {
        // Get the latest message and call callback
        if (messages.length > 0) {
          const latestMessage = messages[messages.length - 1];
          callback(latestMessage);
        }
      },
      [
        firestoreHelpers.where('conversationId', '==', conversationId),
        firestoreHelpers.orderBy('createdAt', 'asc')
      ]
    );
  },

  // Mark a message as read
  async markAsRead(messageId: string) {
    try {
      await messageService.update(messageId, { status: 'read' });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};