import { toast } from "@/components/ui/use-toast";
import { COLLECTIONS, Conversation, CreateDocumentData } from "@/lib/firebase-types";
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const conversationService = new FirestoreService<Conversation>(COLLECTIONS.CONVERSATIONS);

export const conversationsService = {
  firestoreService: conversationService,

  async getMyConversations() {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];

    try {
      // Get conversations where user is either traveler or admin
      const asTraveler = await conversationService.getWithQuery([
        firestoreHelpers.where('travelerId', '==', currentUser.uid),
        firestoreHelpers.orderBy('updatedAt', 'desc')
      ]);

      const asAdmin = await conversationService.getWithQuery([
        firestoreHelpers.where('adminId', '==', currentUser.uid),
        firestoreHelpers.orderBy('updatedAt', 'desc')
      ]);

      // Combine and sort by updatedAt
      const allConversations = [...asTraveler, ...asAdmin];
      allConversations.sort((a, b) => 
        firestoreHelpers.timestampToDate(b.updatedAt).getTime() - 
        firestoreHelpers.timestampToDate(a.updatedAt).getTime()
      );

      return allConversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: "Please try again later",
        variant: "destructive",
      });
      return [];
    }
  },

  /**
   * Find or create the shared traveler–Twende Travel conversation for a user.
   */
  async getOrCreateSupportConversation(travelerId: string) {
    try {
      // Try to find existing support thread (adminId is null)
      const existingConversations = await conversationService.getWithQuery([
        firestoreHelpers.where('travelerId', '==', travelerId),
        firestoreHelpers.where('adminId', '==', null)
      ]);

      if (existingConversations.length > 0) {
        return existingConversations[0];
      }

      // Create new support conversation
      const newConversation = await conversationService.create({
        travelerId,
        adminId: null,
        title: 'Travel Support',
        status: 'active',
        priority: 'normal',
        category: 'support',
      });

      return newConversation;
    } catch (error) {
      console.error('Error getting/creating support conversation:', error);
      throw error;
    }
  },

  subscribeToMyConversations(callback: (conversations: Conversation[]) => void) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      callback([]);
      return () => {};
    }

    // Subscribe to conversations where user is traveler
    const unsubscribeAsTraveler = conversationService.subscribeToCollection(
      (conversations) => {
        // Also get conversations where user is admin
        this.getMyConversations().then(callback);
      },
      [
        firestoreHelpers.where('travelerId', '==', currentUser.uid),
        firestoreHelpers.orderBy('updatedAt', 'desc')
      ]
    );

    // Subscribe to conversations where user is admin
    const unsubscribeAsAdmin = conversationService.subscribeToCollection(
      (conversations) => {
        // Get all conversations for this user
        this.getMyConversations().then(callback);
      },
      [
        firestoreHelpers.where('adminId', '==', currentUser.uid),
        firestoreHelpers.orderBy('updatedAt', 'desc')
      ]
    );

    // Return combined unsubscribe function
    return () => {
      unsubscribeAsTraveler();
      unsubscribeAsAdmin();
    };
  },

  async create(conversationData: CreateDocumentData<Conversation>) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to start a conversation",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      const conversation = await conversationService.create({
        ...conversationData,
        travelerId: conversationData.travelerId || currentUser.uid,
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error creating conversation",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }
};
