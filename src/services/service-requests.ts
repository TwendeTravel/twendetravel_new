// filepath: src/services/service-requests.ts
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/components/ui/use-toast'

export const serviceRequestService = {
  async getAll() {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      throw error
    }
    return data
  },
  async create(payload: { user_id: string; service: string; details: string }) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert(payload)
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      throw error
    }
    return data
  },
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, rate')
    if (error) throw error
    return data || []
  },
  async createRequest(userId: string, items: ServiceRequestItem[], budget: number, totalPrice: number, origin: string, destination: string, description: string) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({ user_id: userId, origin, destination, description, items, budget, total_price: totalPrice, status: 'pending' })
      .select()
      .single();
    if (error) throw error;
    const request = data;
    // Notify Twende Travel in a single shared chat thread
    (async () => {
      try {
        const { conversationService } = await import('@/services/conversations');
        const { chatService } = await import('@/services/chat');
        // find existing traveler–Twende Travel conversation
        const { data: existing, error: findErr } = await supabase
          .from('conversations')
          .select('id')
          .eq('traveler_id', userId)
          .is('admin_id', null)
          .maybeSingle();
        if (findErr) throw findErr;
        // use existing or create new conversation
        const conv = existing?.id
          ? existing
          : await conversationService.create({ title: 'Chat with Twende Travel', admin_id: null, status: 'active' });
        // send notification message once per service request
        await chatService.sendMessage(conv.id, "I've requested a service, please check it out and revert.");
      } catch (err) {
        console.error('Error auto-sending request notification:', err);
      }
    })();
    return request;
  },
  /**
   * Fetch all service requests for the currently signed-in user.
   */
  /**
   * Fetch a page of service requests for the currently signed-in user.
   * @param limit Number of items to fetch per page
   * @param offset Offset (zero-based) for pagination
   */
  async getUserRequests(limit?: number, offset?: number) {
    // get current session & user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const user = session?.user;
    if (!user) throw new Error('Not authenticated');
    // query user-specific requests
    let query = supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', user.id);
    if (typeof limit === 'number' && typeof offset === 'number') {
      query = query.range(offset, offset + limit - 1);
    }
    const { data, error } = await query;
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      throw error;
    }
    return data || [];
  }
}

export interface Service {
  id: string
  name: string
  rate: number
}

export interface ServiceRequestItem {
  service_id: string
  qty: number
}