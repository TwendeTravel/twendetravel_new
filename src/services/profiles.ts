import { supabase } from '@/lib/supabaseClient';

export interface Profile {
  id: string;
  email: string;
  role: 'traveler' | 'admin';
}

export const profileService = {
  /** Fetch all traveler profiles */
  async listTravelers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('role', 'traveler');
    if (error) throw error;
    return data || [];
  }
};
