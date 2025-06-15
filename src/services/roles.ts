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

export const roleService = {
  // Expose the raw permission fetch/set if needed
  getUserPermission: permissionService.getUserPermission,
  setUserPermission: permissionService.setUserPermission,

  /**
   * Fetch all user permission records and map to { user_id, permission_level, role, created_at }
   */
  async getAllUserRoles() {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('user_id, permission_level');
    if (error) throw error;
    return (data ?? []).map((rec) => ({
      user_id: rec.user_id,
      permission_level: rec.permission_level,
      role: rec.permission_level === 1 ? 'admin' : 'traveller'
        }));
  },

  /**
   * Update a user's permission_level based on a role string ('admin' or 'traveller')
   */
  async updateUserRole(userId: string, newRole: 'admin' | 'traveller') {
    const level = newRole === 'admin' ? 1 : 0;
    await permissionService.setUserPermission(userId, level);
    return { user_id: userId, permission_level: level, role: newRole };
  }
};