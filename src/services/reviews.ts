
import { toast } from "@/components/ui/use-toast";
import { COLLECTIONS, Review, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const reviewService = new FirestoreService<Review>(COLLECTIONS.REVIEWS);

export const reviewsService = {
  firestoreService: reviewService,

  async getByDestination(destinationId: string): Promise<Review[]> {
    try {
      return await reviewService.getWithQuery([
        firestoreHelpers.where('destinationId', '==', destinationId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error fetching reviews",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async getByUser(userId?: string): Promise<Review[]> {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return [];
    }

    try {
      return await reviewService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  async create(reviewData: CreateDocumentData<Review>): Promise<Review> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a review",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    try {
      const review = await reviewService.create({
        ...reviewData,
        userId: reviewData.userId || currentUser.uid,
      });

      toast({
        title: "Success",
        description: "Review created successfully",
      });

      return review;
    } catch (error: any) {
      console.error('Error creating review:', error);
      toast({
        title: "Error creating review",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  },

  async update(id: string, reviewData: Partial<Review>): Promise<Review> {
    try {
      const updatedReview = await reviewService.update(id, reviewData);

      toast({
        title: "Success",
        description: "Review updated successfully",
      });

      return updatedReview;
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast({
        title: "Error updating review",
        description: error.message || "Please try again later", 
        variant: "destructive",
      });
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await reviewService.delete(id);
      
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error deleting review",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }
};
