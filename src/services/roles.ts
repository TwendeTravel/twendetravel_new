import { supabase } from '@/lib/supabaseClient';

export interface RoleRecord {
  user_id: string;
  role: number;  // 0 = user, 1 = admin
}

export const roleService = {
  /** Fetch the current user's role record */
  async getCurrentUserRole(userId: string): Promise<RoleRecord> {
    const { data, error } = await supabase
      .from<RoleRecord>('roles')
      .select('user_id, role')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data as RoleRecord;
  },
  /** Assign a role to a user (0 = user, 1 = admin) */
  async setUserRole(userId: string, role: number) {
    const { data, error } = await supabase
      .from<RoleRecord>('roles')
      .upsert({ user_id: userId, role })
      .select()
      .single();
    if (error) throw error;
    return data as RoleRecord;
  },
};