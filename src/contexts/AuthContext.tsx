import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

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
        // Clear any outdated 'role' metadata (to avoid DB-level SET ROLE errors)
        const md = { ...u.user_metadata };
        if (md.role !== undefined) {
          delete md.role;
          supabase.auth.updateUser({ data: md }).catch(console.error);
        }
        setUser({ id: u.id, email: u.email!, full_name: u.user_metadata.full_name });
      }
      setIsLoading(false);
    })();
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        const u = session.user;
        // Clear outdated 'role' metadata
        const md2 = { ...u.user_metadata };
        if (md2.role !== undefined) {
          delete md2.role;
          supabase.auth.updateUser({ data: md2 }).catch(console.error);
        }
        setUser({ id: u.id, email: u.email!, full_name: u.user_metadata.full_name });
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      throw error;
    }
    const u = data.user;
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