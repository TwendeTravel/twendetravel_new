import { FirestoreService, firestoreHelpers } from '@/lib/firestore-service';
import { COLLECTIONS, UserPermission, UserRole } from '@/lib/firebase-types';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PermissionRecord {
  id?: string;
  userId: string;
  permission: number;  // 0 = user, 1 = admin
}

export const permissionService = {
  firestoreService: new FirestoreService<UserPermission>(COLLECTIONS.USER_PERMISSIONS),

  /**
   * Fetch the current user's permission record. Defaults to user (0) if no record.
   */
  async getUserPermission(userId: string): Promise<PermissionRecord> {
    try {
      const permissions = await this.firestoreService.getWithQuery([
        firestoreHelpers.where('userId', '==', userId)
      ]);

      if (permissions.length > 0) {
        const perm = permissions[0];
        return {
          id: perm.id,
          userId: perm.userId,
          permission: perm.permission,
        };
      }

      // Return default if no record found
      return {
        userId,
        permission: 0,
      };
    } catch (error) {
      console.error('Error fetching user permission:', error);
      return {
        userId,
        permission: 0,
      };
    }
  },

  /**
   * Assign permission level to a user (0 = traveler, 1 = admin)
   */
  async setUserPermission(userId: string, permission: number): Promise<PermissionRecord> {
    try {
      // Check if permission already exists
      const existingPermissions = await this.firestoreService.getWithQuery([
        firestoreHelpers.where('userId', '==', userId)
      ]);

      if (existingPermissions.length > 0) {
        // Update existing permission
        const updated = await this.firestoreService.update(existingPermissions[0].id, {
          permission,
        });
        return {
          id: updated.id,
          userId: updated.userId,
          permission: updated.permission,
        };
      } else {
        // Create new permission
        const created = await this.firestoreService.create({
          userId,
          permission,
        });
        return {
          id: created.id,
          userId: created.userId,
          permission: created.permission,
        };
      }
    } catch (error) {
      console.error('Error setting user permission:', error);
      throw error;
    }
  },
};

export const roleService = {
  // Expose the raw permission fetch/set if needed
  getUserPermission: permissionService.getUserPermission,
  setUserPermission: permissionService.setUserPermission,

  /**
   * Fetch all user roles with email and join date
   */
  async getAllUserRoles(): Promise<UserRole[]> {
    try {
      // Get all user permissions
      const permissions = await permissionService.firestoreService.getAll();
      
      // Get user documents for each permission
      const userRoles: UserRole[] = [];
      
      for (const permission of permissions) {
        try {
          const userDocRef = doc(db, COLLECTIONS.USERS, permission.userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userRoles.push({
              userId: permission.userId,
              email: userData.email,
              role: permission.permission === 1 ? 'admin' : 'traveller',
              createdAt: userData.createdAt,
            });
          }
        } catch (error) {
          console.error(`Error fetching user data for ${permission.userId}:`, error);
        }
      }

      return userRoles;
    } catch (error) {
      console.error('Error fetching all user roles:', error);
      throw error;
    }
  },

  /**
   * Update a user's permission_level based on a role string ('admin' or 'traveller')
   */
  async updateUserRole(userId: string, newRole: 'admin' | 'traveller') {
    const level = newRole === 'admin' ? 1 : 0;
    await permissionService.setUserPermission(userId, level);
    return { userId, permission: level, role: newRole };
  }
};