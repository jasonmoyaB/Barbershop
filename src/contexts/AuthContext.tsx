import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import type { UserProfile } from '../types/user.types';

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isUser: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);

        // Supabase Auth callbacks must stay synchronous. Defer profile loading
        // so signInWithPassword can resolve after the auth state update.
        setTimeout(() => {
          void loadUserProfile(session.user.id).finally(() => {
            setIsLoading(false);
          });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      await loadUserProfile(session.user.id);
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }

  async function loadUserProfile(userId: string) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[AuthContext] Error al cargar perfil:', error);
      setUser(null);
      return;
    }

    setUser(profile ? (profile as UserProfile) : null);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signOut,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
