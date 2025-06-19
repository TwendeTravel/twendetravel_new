import { supabase } from '@/lib/supabaseClient';

export interface SavedDestination {
  user_id: string;
  destination_id: string;
  created_at: string;
}

export const savedDestinationsService = {
  async listForUser(userId: string): Promise<SavedDestination[]> {
    const { data, error } = await supabase
      .from('user_saved_destinations')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async save(userId: string, destinationId: string) {
    const { error } = await supabase
      .from('user_saved_destinations')
      .insert({ user_id: userId, destination_id: destinationId });
    if (error) throw error;
  },

  async unsave(userId: string, destinationId: string) {
    const { error } = await supabase
      .from('user_saved_destinations')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);
    if (error) throw error;
  }
};
