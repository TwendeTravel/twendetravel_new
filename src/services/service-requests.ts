import { apiFetch } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export interface ServiceRequest {
  id: string;
  user_id: string;
  service_type: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const serviceRequestService = {
  async getUserRequests(): Promise<ServiceRequest[]> {
    try {
      return await apiFetch<ServiceRequest[]>('service-requests');
    } catch (error: any) {
      toast({
        title: 'Error fetching requests',
        description: error.message || 'Unable to load service requests',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async create(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      return await apiFetch<ServiceRequest>('service-requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      toast({
        title: 'Error creating request',
        description: error.message || 'Unable to create service request',
        variant: 'destructive',
      });
      throw error;
    }
  },
};