import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { permissionService, PermissionRecord } from '@/services/roles';

/**
 * Hook to determine the current user's role based on the `roles` table.
 * `role` column: 0 = regular user (traveler), 1 = admin
 */
export function useRole() {
  const { user } = useAuth();

  // permission_level: 0 = traveler, 1 = admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTraveller, setIsTraveller] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermission = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsTraveller(true);
        setIsLoading(false);
        return;
      }
      try {
        const rec: PermissionRecord = await permissionService.getUserPermission(user.id);
        setIsAdmin(rec.permission_level === 1);
        setIsTraveller(rec.permission_level === 0);
      } catch (err) {
        console.error('Error fetching permission:', err);
        setIsAdmin(false);
        setIsTraveller(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermission();
  }, [user]);

  return { isAdmin, isTraveller, isLoading };
}
