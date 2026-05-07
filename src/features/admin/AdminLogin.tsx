import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';

type AdminLoginProps = {
  onLogin: () => void;
};

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Intentando login con:', { email, passwordLength: password.length });
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Respuesta de Supabase:', { data, error: signInError });

    if (signInError) {
      console.error('Error de login:', signInError);
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Check if user is admin
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      console.log('Profile data:', { profile, profileError });

      if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        setError('No tienes permisos de administrador');
        setLoading(false);
        return;
      }

      onLogin();
    }
    
    setLoading(false);
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Panel de Administración</h1>
        <p className="admin-login-subtitle">Negro Barbershop</p>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-field">
            <label htmlFor="admin-email" className="form-label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password" className="form-label">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              required
            />
          </div>
          
          {error && (
            <div className="form-errors" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="admin-login-hint">
          ¿No tienes cuenta?{' '}
          <a href="/admin/register" style={{ textDecoration: 'underline', color: 'var(--text)' }}>
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
