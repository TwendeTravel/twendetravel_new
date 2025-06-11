import { supabase } from '@/lib/supabaseClient';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  popular: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const destinationService = {
  async getAll(): Promise<Destination[]> {
    const { data, error } = await supabase
      .from<Destination>('destinations')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data;
  },

  async getById(id: string): Promise<Destination> {
    const { data, error } = await supabase
      .from<Destination>('destinations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },
};