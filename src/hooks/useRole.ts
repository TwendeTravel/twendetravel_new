import { useEffect, useState } from 'react';
import AuthContextModule from '@/contexts/AuthContext';
import { permissionService, PermissionRecord } from '@/services/roles';

const { useAuth } = AuthContextModule;

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
        const rec: PermissionRecord = await permissionService.getUserPermission(user.uid);
        setIsAdmin(rec.permission === 1);
        setIsTraveller(rec.permission === 0);
      } catch (err: any) {
        console.error('Error fetching permission:', err);
        // Handle network errors gracefully - default to traveller role
        if (err.code === 'unavailable' || err.code === 'failed-precondition' || 
            err.message?.includes('offline') || err.message?.includes('network')) {
          console.warn('Network unavailable, defaulting to traveller role');
        }
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
