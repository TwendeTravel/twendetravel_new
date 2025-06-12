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
  async createRequest(userId: string, items: ServiceRequestItem[], budget: number, totalPrice: number) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({ user_id: userId, items, budget, total_price: totalPrice, status: 'pending' })
      .select()
      .single()
    if (error) throw error
    return data
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