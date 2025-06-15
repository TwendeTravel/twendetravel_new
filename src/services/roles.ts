import { supabase } from '@/lib/supabaseClient';

export interface RoleRecord {
  user_id: string;
  role: number;  // 0 = user, 1 = admin
}

export const roleService = {
  /**
   * Fetch the current user's role record. If none exists or table missing, default to role=0 (traveler).
   */
  async getCurrentUserRole(userId: string): Promise<RoleRecord> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('user_id, role')
        .eq('user_id', userId)
        .maybeSingle();
      // If table missing, Postgres error code 42P01
      if (error && (error.code === '42P01' || error.message.includes('relation "roles" does not exist'))) {
        return { user_id: userId, role: 0 };
      }
      if (error) throw error;
      return data ?? { user_id: userId, role: 0 };
    } catch (err: any) {
      console.warn('getCurrentUserRole fallback:', err.message);
      return { user_id: userId, role: 0 };
    }
  },
  /** Assign a role to a user (0 = user, 1 = admin) */
  async setUserRole(userId: string, role: number): Promise<RoleRecord> {
    const { data, error } = await supabase
      .from('roles')
      .upsert({ user_id: userId, role })
      .select()
      .single();
    if (error) throw error;
    return data as RoleRecord;
  },
};