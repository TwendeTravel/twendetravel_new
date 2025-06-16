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
    // Automatically notify Twende Travel (no specific admin) via chat
    (async () => {
      try {
        const { conversationService } = await import('@/services/conversations');
        const { messageService } = await import('@/services/messages');
        // create a new conversation as 'Twende Travel' (admin_id null)
        const conv = await conversationService.create({ title: `Request #${request.id}`, admin_id: null });
        console.log('Auto-notify: conversation created', conv.id);
        const text = `New service request #${request.id}: ${description}. Origin: ${origin}, Destination: ${destination}, Budget: ${budget}.`;
        // Insert message with sender_id (the requester)
        const { data: msg, error: msgErr } = await supabase
          .from('messages')
          .insert([{ conversation_id: conv.id, sender_id: userId, text }])
          .select()
          .single();
        if (msgErr) throw msgErr;
        console.log('Auto-notify: message sent', msg.id);
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