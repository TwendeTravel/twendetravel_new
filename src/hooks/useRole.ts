import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { roleService, RoleRecord } from '@/services/roles';

/**
 * Hook to determine the current user's role based on the `roles` table.
 * `role` column: 0 = regular user (traveler), 1 = admin
 */
export function useRole() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        try {
          const record: RoleRecord = await roleService.getCurrentUserRole(user.id);
          setIsAdmin(record.role === 1);
        } catch (err) {
          console.error('Failed to fetch user role:', err);
          setIsAdmin(false);
        }
      }
      setIsLoading(false);
    }
    fetchRole();
  }, [user]);

  return { isAdmin, isTraveller: !isAdmin, isLoading };
}
