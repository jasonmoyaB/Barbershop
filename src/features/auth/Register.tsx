import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';

type RegisterProps = {
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function Register({ onSuccess, onCancel }: RegisterProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // El AuthContext detectará el registro y cargará el perfil automáticamente
    onSuccess();
    setLoading(false);
  }

  return (
    <div className="auth-form">
      <h2 className="auth-form-title">Crear Cuenta</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="register-fullName" className="form-label">
            Nombre Completo
          </label>
          <input
            id="register-fullName"
            name="fullName"
            type="text"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Juan Pérez"
            required
            autoFocus
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-email" className="form-label">
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-password" className="form-label">
            Contraseña
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="form-errors" role="alert">
            <p>{error}</p>
          </div>
        )}

        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
