import { supabase } from '@/lib/supabaseClient';

export interface PermissionRecord {
  user_id: string;
  permission_level: number;  // 0 = user, 1 = admin
}

export const permissionService = {
  /**
   * Fetch the current user's permission record. Defaults to user (0) if no record.
   */
  async getUserPermission(userId: string): Promise<PermissionRecord> {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('user_id, permission_level')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ?? { user_id: userId, permission_level: 0 };
  },
  /** Assign permission level to a user (0 = traveler, 1 = admin) */
  async setUserPermission(userId: string, permission_level: number): Promise<PermissionRecord> {
    const { data, error } = await supabase
      .from('user_permissions')
      .upsert({ user_id: userId, permission_level })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};