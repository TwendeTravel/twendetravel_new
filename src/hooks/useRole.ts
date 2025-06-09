
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { roleService, UserRole } from '@/services/roles';

export function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const userRole = await roleService.getCurrentUserRole();
        setRole(userRole);
      } else {
        setRole(null);
      }
      setIsLoading(false);
    }

    fetchRole();
  }, [user]);

  return {
    role,
    isLoading,
    isAdmin: role?.role === 'admin',
    isTraveller: role?.role === 'traveller',
  };
}
