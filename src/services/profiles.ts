import { COLLECTIONS, User } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';

const profileService = new FirestoreService<User>(COLLECTIONS.USERS);

export const profilesService = {
  firestoreService: profileService,

  /** Fetch all traveler profiles */
  async listTravelers(): Promise<User[]> {
    try {
      return await profileService.getWithQuery([
        firestoreHelpers.where('role', '==', 'traveler'),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching traveler profiles:', error);
      throw error;
    }
  },

  /** Fetch all admin profiles */
  async listAdmins(): Promise<User[]> {
    try {
      return await profileService.getWithQuery([
        firestoreHelpers.where('role', '==', 'admin'),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching admin profiles:', error);
      throw error;
    }
  },

  /** Get profile by user ID */
  async getById(id: string): Promise<User | null> {
    try {
      return await profileService.getById(id);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /** Update profile */
  async update(id: string, profileData: Partial<User>): Promise<User> {
    try {
      return await profileService.update(id, profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};
