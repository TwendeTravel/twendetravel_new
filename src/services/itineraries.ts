
import { toast } from "@/components/ui/use-toast";
import { COLLECTIONS, Itinerary, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const itineraryService = new FirestoreService<Itinerary>(COLLECTIONS.ITINERARIES);

export const itinerariesService = {
  firestoreService: itineraryService,

  async getAll() {
    try {
      const itineraries = await itineraryService.getWithQuery([
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
      
      return itineraries;
    } catch (error: any) {
      console.error('Error fetching itineraries:', error);
      toast({
        title: "Error fetching itineraries",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const itinerary = await itineraryService.getById(id);
      if (!itinerary) {
        throw new Error('Itinerary not found');
      }
      return itinerary;
    } catch (error: any) {
      console.error('Error fetching itinerary:', error);
      toast({
        title: "Error fetching itinerary",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async getUserItineraries(userId?: string) {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return [];
    }

    try {
      return await itineraryService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching user itineraries:', error);
      throw error;
    }
  },

  async create(itineraryData: CreateDocumentData<Itinerary>) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an itinerary",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      const itinerary = await itineraryService.create({
        ...itineraryData,
        userId: itineraryData.userId || currentUser.uid,
      });

      toast({
        title: "Success",
        description: "Itinerary created successfully",
      });

      return itinerary;
    } catch (error: any) {
      console.error('Error creating itinerary:', error);
      toast({
        title: "Error creating itinerary",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async update(id: string, itineraryData: Partial<Itinerary>) {
    try {
      const updatedItinerary = await itineraryService.update(id, itineraryData);

      toast({
        title: "Success",
        description: "Itinerary updated successfully",
      });

      return updatedItinerary;
    } catch (error: any) {
      console.error('Error updating itinerary:', error);
      toast({
        title: "Error updating itinerary",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await itineraryService.delete(id);
      
      toast({
        title: "Success",
        description: "Itinerary deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting itinerary:', error);
      toast({
        title: "Error deleting itinerary",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }
};
