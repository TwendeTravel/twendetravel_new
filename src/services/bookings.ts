
import { toast } from "@/components/ui/use-toast";
import { COLLECTIONS, Booking, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const bookingService = new FirestoreService<Booking>(COLLECTIONS.BOOKINGS);

export const bookingsService = {
  firestoreService: bookingService,

  async create(bookingData: CreateDocumentData<Booking>): Promise<Booking> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a booking",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }

    try {
      const booking = await bookingService.create({
        ...bookingData,
        userId: bookingData.userId || currentUser.uid,
      });
      
      toast({
        title: "Booking created successfully",
        description: "Your booking has been created",
      });
      
      return booking;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error creating booking",
        description: error.message || 'Unable to create booking',
        variant: "destructive",
      });
      throw error;
    }
  },

  async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    try {
      const booking = await bookingService.update(id, { status });
      
      toast({
        title: "Booking updated successfully",
        description: `Booking status updated to ${status}`,
      });
      
      return booking;
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error updating booking",
        description: error.message || 'Unable to update booking',
        variant: "destructive",
      });
      throw error;
    }
  },

  async getById(id: string): Promise<Booking> {
    try {
      const booking = await bookingService.getById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  async getUserBookings(userId?: string): Promise<Booking[]> {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      return [];
    }

    try {
      return await bookingService.getWithQuery([
        firestoreHelpers.where('userId', '==', targetUserId),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }
};
