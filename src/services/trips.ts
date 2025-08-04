
import { toast } from "@/components/ui/use-toast";
import { COLLECTIONS, Trip, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const tripService = new FirestoreService<Trip>(COLLECTIONS.TRIPS);

export const tripsService = {
  firestoreService: tripService,

  async getAll(): Promise<Trip[]> {
    try {
      return await tripService.getWithQuery([
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast({
        title: "Error fetching trips",
        description: error.message || 'Unable to load trips',
        variant: "destructive",
      });
      throw error;
    }
  },

  async getById(id: string): Promise<Trip> {
    try {
      const trip = await tripService.getById(id);
      if (!trip) {
        throw new Error('Trip not found');
      }
      return trip;
    } catch (error: any) {
      console.error('Error fetching trip:', error);
      toast({
        title: "Error fetching trip",
        description: error.message || 'Unable to load trip',
        variant: "destructive",
      });
      throw error;
    }
  },

  async getUserTrips(userId?: string): Promise<Trip[]> {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return [];
    }

    try {
      return await tripService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching user trips:', error);
      throw error;
    }
  },

  async create(tripData: CreateDocumentData<Trip>): Promise<Trip> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a trip",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      const trip = await tripService.create({
        ...tripData,
        userId: tripData.userId || currentUser.uid,
      });

      toast({
        title: "Success",
        description: "Trip created successfully",
      });

      return trip;
    } catch (error: any) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error creating trip",
        description: error.message || 'Unable to create trip',
        variant: "destructive",
      });
      throw error;
    }
  },

  async update(id: string, tripData: Partial<Trip>): Promise<Trip> {
    try {
      const updatedTrip = await tripService.update(id, tripData);

      toast({
        title: "Success",
        description: "Trip updated successfully",
      });

      return updatedTrip;
    } catch (error: any) {
      console.error('Error updating trip:', error);
      toast({
        title: "Error updating trip",
        description: error.message || 'Unable to update trip',
        variant: "destructive",
      });
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await tripService.delete(id);
      
      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Error deleting trip",
        description: error.message || 'Unable to delete trip',
        variant: "destructive",
      });
      throw error;
    }
  }
};
