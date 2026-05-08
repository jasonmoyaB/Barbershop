import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

type AdminLoginProps = {
  onLogin: () => void;
};

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      navigate('/admin', { replace: true });
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
            <div className="form-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2.3 3.7a1 1 0 0 1 1.4-1.4l16.6 16.6a1 1 0 0 1-1.4 1.4l-2.4-2.4A10.9 10.9 0 0 1 12 19C6.3 19 2.1 14.6 1 12c.5-1.2 1.8-3.4 3.8-5.2L2.3 3.7zm5.1 5.1a4 4 0 0 0 5.4 5.4l-1.6-1.6a2 2 0 0 1-2.2-2.2l-1.6-1.6zM9.6 7.5A4 4 0 0 1 12 7c2.2 0 4.1 1.8 4.1 4 0 .8-.2 1.5-.6 2.1l-1.6-1.6a2 2 0 0 0-2.6-2.6L9.6 7.5zM12 5c5.7 0 9.9 4.4 11 7-.5 1.2-1.8 3.4-3.8 5.2l-2-2A8.5 8.5 0 0 0 21 12c-1-2-4.6-5-9-5-1.1 0-2.2.2-3.1.5l-1.6-1.6C8.8 5.3 10.3 5 12 5z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 5c5.7 0 9.9 4.4 11 7-1.1 2.6-5.3 7-11 7S2.1 14.6 1 12c1.1-2.6 5.3-7 11-7zm0 2C7.6 7 4.4 10.1 3.2 12 4.4 13.9 7.6 17 12 17s7.6-3.1 8.8-5C19.6 10.1 16.4 7 12 7zm0 2.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2zm0 1.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </div>
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
