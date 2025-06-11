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
  // …etc…
}