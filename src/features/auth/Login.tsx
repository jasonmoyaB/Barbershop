import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';

type LoginProps = {
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function Login({ onSuccess, onCancel }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[Login] Iniciando login...');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[Login] Respuesta auth:', { error: signInError });

      if (signInError) {
        console.error('[Login] Error en auth:', signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      console.log('[Login] Login exitoso, AuthContext manejará el resto');
      // El AuthContext detectará el login y cargará el perfil automáticamente
      onSuccess();
      setLoading(false);
    } catch (err) {
      console.error('[Login] ERROR NO CAPTURADO:', err);
      setError('Error inesperado durante el login');
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <h2 className="auth-form-title">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="login-email" className="form-label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            autoFocus
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password" className="form-label">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
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

        {onCancel && (
          <button
            type="button"
            className="form-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
