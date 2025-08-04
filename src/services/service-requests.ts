// filepath: src/services/service-requests.ts
import { toast } from '@/components/ui/use-toast'
import { conversationsService } from '@/services/conversations';
import { chatService } from '@/services/chat';
import { COLLECTIONS, ServiceRequest, Service, CreateDocumentData } from '@/lib/firebase-types';
import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';

const serviceRequestServiceInstance = new FirestoreService<ServiceRequest>(COLLECTIONS.SERVICE_REQUESTS);
const serviceServiceInstance = new FirestoreService<Service>(COLLECTIONS.SERVICES);

export const serviceRequestService = {
  async getAll() {
    try {
      return await serviceRequestServiceInstance.getAll();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      throw error
    }
  },

  async create(payload: { userId: string; type: string; description: string }) {
    try {
      return await serviceRequestServiceInstance.create({
        userId: payload.userId,
        type: payload.type as any,
        description: payload.description,
        status: 'pending',
        priority: 'normal',
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      throw error
    }
  },

  async getServices() {
    try {
      return await serviceServiceInstance.getAll();
    } catch (error) {
      throw error
    }
  },

  async createRequest(userId: string, items: ServiceRequestItem[], budget: number, totalPrice: number, origin: string, destination: string, description: string) {
    try {
      const request = await serviceRequestServiceInstance.create({
        userId,
        type: 'other',
        description: `${description}\nOrigin: ${origin}\nDestination: ${destination}\nBudget: ${budget}\nTotal Price: ${totalPrice}`,
        status: 'pending',
        priority: 'normal',
      });

      // Notify Twende Travel via shared support conversation
      (async () => {
        try {
          const conv = await conversationsService.getOrCreateSupportConversation(userId);
          await chatService.sendMessage(conv.id, "I've requested a service, please check it out and revert.");
        } catch (err) {
          console.error('Error auto-sending service request notification:', err);
        }
      })();
      return request;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch all service requests for the currently signed-in user.
   */
  async getUserRequests(limit?: number, offset?: number) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    try {
      const baseConstraints = [
        firestoreHelpers.where('userId', '==', currentUser.uid),
        firestoreHelpers.orderBy('createdAt', 'desc')
      ];

      if (typeof limit === 'number') {
        const limitedConstraints = [
          ...baseConstraints,
          firestoreHelpers.limit(limit)
        ];
        return await serviceRequestServiceInstance.getWithQuery(limitedConstraints);
      }

      return await serviceRequestServiceInstance.getWithQuery(baseConstraints);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      throw error;
    }
  }
}

export interface ServiceRequestItem {
  service_id: string
  qty: number
}

// Re-export Service type from firebase-types
export type { Service } from '@/lib/firebase-types';