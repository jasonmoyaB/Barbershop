import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import AdminLogin from './AdminLogin';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkAdminRole(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await checkAdminRole(session.user.id);
    } else {
      setIsAuthenticated(false);
    }
    
    setIsChecking(false);
  }

  async function checkAdminRole(userId: string) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile && profile.role === 'admin') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      await supabase.auth.signOut();
    }
  }

  function handleLogin() {
    setIsAuthenticated(true);
  }

  if (isChecking) {
    return <div className="admin-loading">Verificando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <>{children}</>;
}
