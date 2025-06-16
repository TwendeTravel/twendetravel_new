import { supabase } from '@/lib/supabaseClient';

export interface PermissionRecord {
  id?: string;
  twende_user: string;
  permission: number;  // 0 = user, 1 = admin
}

export const permissionService = {
  /**
   * Fetch the current user's permission record. Defaults to user (0) if no record.
   */
  async getUserPermission(userId: string): Promise<PermissionRecord> {
    const { data, error } = await supabase
      .from('twende_permissions')
      .select('id, twende_user, permission')
      .eq('twende_user', userId)
      .maybeSingle();
    if (error) throw error;
    return (
      data ?? { twende_user: userId, permission: 0 }
    );
  },
  /** Assign permission level to a user (0 = traveler, 1 = admin) */
  async setUserPermission(userId: string, permission: number): Promise<PermissionRecord> {
    const { data, error } = await supabase
      .from('twende_permissions')
      .upsert({ twende_user: userId, permission })
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
      .from('twende_permissions')
      .select('id, twende_user, permission');
    if (error) throw error;
    return (data ?? []).map((rec) => ({
      user_id: rec.twende_user,
      permission: rec.permission,
      role: rec.permission === 1 ? 'admin' : 'traveller',
      // no created_at on new table
    }));
  },

  /**
   * Update a user's permission_level based on a role string ('admin' or 'traveller')
   */
  async updateUserRole(userId: string, newRole: 'admin' | 'traveller') {
    const level = newRole === 'admin' ? 1 : 0;
    await permissionService.setUserPermission(userId, level);
    return { twende_user: userId, permission: level, role: newRole };
  }
};