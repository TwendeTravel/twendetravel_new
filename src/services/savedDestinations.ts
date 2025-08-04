import { COLLECTIONS, SavedDestination } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const savedDestinationService = new FirestoreService<SavedDestination>(COLLECTIONS.SAVED_DESTINATIONS);

export const savedDestinationsService = {
  firestoreService: savedDestinationService,

  async listForUser(userId?: string): Promise<SavedDestination[]> {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return [];
    }

    try {
      return await savedDestinationService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
      throw error;
    }
  },

  async save(destinationId: string, userId?: string) {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      throw new Error('User not authenticated');
    }

    try {
      // Check if already saved
      const existing = await savedDestinationService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.where('destinationId', '==', destinationId)
      ]);

      if (existing.length === 0) {
        await savedDestinationService.create({
          userId: targetUserId,
          destinationId
        });
      }
    } catch (error) {
      console.error('Error saving destination:', error);
      throw error;
    }
  },

  async unsave(destinationId: string, userId?: string) {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      throw new Error('User not authenticated');
    }

    try {
      const saved = await savedDestinationService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.where('destinationId', '==', destinationId)
      ]);

      for (const item of saved) {
        await savedDestinationService.delete(item.id);
      }
    } catch (error) {
      console.error('Error unsaving destination:', error);
      throw error;
    }
  },

  async isDestinationSaved(destinationId: string, userId?: string): Promise<boolean> {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return false;
    }

    try {
      const saved = await savedDestinationService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.where('destinationId', '==', destinationId)
      ]);

      return saved.length > 0;
    } catch (error) {
      console.error('Error checking if destination is saved:', error);
      return false;
    }
  }
};
