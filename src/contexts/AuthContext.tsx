import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { permissionService } from '@/services/roles';

// User type with full name stored in metadata
type User = {
  id: string;
  email: string;
  full_name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { full_name?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // initialize session & listen for auth changes
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
      const u = session.user;
      // Remove any 'role' metadata key so it isn't included in the session JWT
      await supabase.auth.updateUser({ data: { role: null } }).catch(console.error);
      setUser({ id: u.id, email: u.email!, full_name: u.user_metadata.full_name });
      // Seed default permission if missing, after metadata cleared
      permissionService.getUserPermission(u.id).then((rec) => {
        if (rec.id === undefined) {
          permissionService.setUserPermission(u.id, 0)
            .catch(err => console.error('Permission seeding error:', err));
        }
      }).catch(console.error);
      }
      setIsLoading(false);
    })();
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        const u = session.user;
        // Remove any 'role' metadata key
        await supabase.auth.updateUser({ data: { role: null } }).catch(console.error);
        setUser({ id: u.id, email: u.email!, full_name: u.user_metadata.full_name });
        // Seed default permission if missing
        permissionService.getUserPermission(u.id).then((rec) => {
          if (rec.id === undefined) {
            permissionService.setUserPermission(u.id, 0)
              .catch(err => console.error('Permission seeding error:', err));
          }
        }).catch(console.error);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      throw error;
    }
    const session = signInData.session;
    const u = signInData.user;
    // Remove any custom 'role' metadata by updating only full_name
    await supabase.auth.updateUser({ data: { full_name: u.user_metadata.full_name } }).catch(console.error);
    // Refresh session tokens to get JWT without old role claim
    if (session) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
    }
    setUser({ id: u.id, email: u.email!, full_name: u.user_metadata.full_name });
  };

  const register = async (email: string, password: string, full_name: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_TO || window.location.origin
      }
    });
    setIsLoading(false);
    // If signup fails due to user_permissions insert, ignore and continue
    if (error) {
      if (error.message.includes('permission denied for table user_permissions')) {
        console.warn('Ignored permission error during signup:', error.message);
      } else {
        toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
        throw error;
      }
    }
    const u = data.user;
    if (data.session) {
      // auto-logged in if session present
      setUser({ id: u.id, email: u.email!, full_name });
      toast({ title: 'Sign up successful', description: 'Welcome!' });
      // create default permission record in twende_permissions
      permissionService.setUserPermission(u.id, 0).catch((err) => console.error('Permission seeding error:', err));
    } else {
      // email confirmation required
      toast({ title: 'Check your email', description: 'Please confirm your address before logging in.' });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Error signing out', description: error.message, variant: 'destructive' });
      throw error;
    }
    setUser(null);
    toast({ title: 'Signed out successfully', description: "You've been logged out." });
  };

  const updateProfile = async (data: { full_name?: string }) => {
    const { data: userData, error } = await supabase.auth.updateUser({ data });
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      throw error;
    }
    setUser({ id: userData.id, email: userData.email!, full_name: userData.user_metadata.full_name });
    toast({ title: 'Profile updated', description: 'Your profile was updated.' });
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };