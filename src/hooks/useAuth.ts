import { useEffect } from 'react';
import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  checkAdminStatus: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  isLoading: true,

  setSession: (session) => {
    set({ session, user: session?.user || null });
  },

  checkAdminStatus: async (email) => {
    if (!email) {
      set({ isAdmin: false, isLoading: false });
      return;
    }

    try {
      // NOTE: This is just a frontend check mapped to the UI.
      // Real authorization MUST be enforced by Supabase RLS policies!
      const { data, error } = await supabase
        .from('admin_allowlist')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      set({ isAdmin: !!data, isLoading: false });
    } catch (error) {
      console.error('Error checking admin status:', error);
      set({ isAdmin: false, isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAdmin: false });
  }
}));

export const useAuth = () => {
  const { session, user, isAdmin, isLoading, setSession, checkAdminStatus, signOut } = useAuthStore();

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        checkAdminStatus(session.user.email);
      } else {
        useAuthStore.setState({ isLoading: false });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.email) {
          checkAdminStatus(session.user.email);
        } else {
          useAuthStore.setState({ isAdmin: false, isLoading: false });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, checkAdminStatus]);

  const signInWithGoogle = async () => {
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      }
    });

    if (error) {
      throw error;
    }
  };

  return {
    session,
    user,
    isAdmin,
    isLoading,
    signInWithGoogle,
    signOut
  };
};
