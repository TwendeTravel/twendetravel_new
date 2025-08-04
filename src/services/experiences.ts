
import { toast } from "@/components/ui/use-toast";
import { COLLECTIONS, Experience, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

// Re-export the Experience type for convenience
export type { Experience } from '@/lib/firebase-types';

const experienceService = new FirestoreService<Experience>(COLLECTIONS.EXPERIENCES);

export const experiencesService = {
  firestoreService: experienceService,

  async getAll() {
    try {
      const experiences = await experienceService.getWithQuery([
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
      
      return experiences;
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast({
        title: "Error fetching experiences",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const experience = await experienceService.getById(id);
      if (!experience) {
        throw new Error('Experience not found');
      }
      return experience;
    } catch (error: any) {
      console.error('Error fetching experience:', error);
      toast({
        title: "Error fetching experience",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async getByDestination(destinationId: string) {
    try {
      return await experienceService.getWithQuery([
        firestoreHelpers.where('destinationId', '==', destinationId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching destination experiences:', error);
      throw error;
    }
  },

  async create(experienceData: CreateDocumentData<Experience>) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an experience",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      const experience = await experienceService.create(experienceData);

      toast({
        title: "Success",
        description: "Experience created successfully",
      });

      return experience;
    } catch (error: any) {
      console.error('Error creating experience:', error);
      toast({
        title: "Error creating experience",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async update(id: string, experienceData: Partial<Experience>) {
    try {
      const updatedExperience = await experienceService.update(id, experienceData);

      toast({
        title: "Success",
        description: "Experience updated successfully",
      });

      return updatedExperience;
    } catch (error: any) {
      console.error('Error updating experience:', error);
      toast({
        title: "Error updating experience",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await experienceService.delete(id);
      
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error deleting experience",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }
};
