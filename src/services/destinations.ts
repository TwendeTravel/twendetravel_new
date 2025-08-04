import { COLLECTIONS, Destination } from '@/lib/firebase-types';
import { FirestoreService } from '@/lib/firestore-service';

// Re-export the Destination type for convenience
export type { Destination } from '@/lib/firebase-types';

const destinationService = new FirestoreService<Destination>(COLLECTIONS.DESTINATIONS);

export const destinationsService = {
  firestoreService: destinationService,

  async getAll(): Promise<Destination[]> {
    try {
      return await destinationService.getAll();
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Destination> {
    try {
      const destination = await destinationService.getById(id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return destination;
    } catch (error) {
      console.error('Error fetching destination:', error);
      throw error;
    }
  },

  async create(destinationData: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await destinationService.create(destinationData);
    } catch (error) {
      console.error('Error creating destination:', error);
      throw error;
    }
  },

  async update(id: string, destinationData: Partial<Destination>) {
    try {
      return await destinationService.update(id, destinationData);
    } catch (error) {
      console.error('Error updating destination:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await destinationService.delete(id);
    } catch (error) {
      console.error('Error deleting destination:', error);
      throw error;
    }
  }
};