import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    console.log('Intentando registro con:', { email: formData.email, fullName: formData.fullName });

    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    console.log('Respuesta de signup:', { data, error: signUpError });

    if (signUpError) {
      console.error('Error en signup:', signUpError);
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      console.log('Usuario creado:', data.user);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h1 className="admin-login-title">Registro Exitoso</h1>
          <p className="admin-login-subtitle">
            Usuario creado correctamente. Redirigiendo al panel de administración...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Registrar Administrador</h1>
        <p className="admin-login-subtitle">Negro Barbershop</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-field">
            <label htmlFor="fullName" className="form-label">
              Nombre Completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@negrobarbershop.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
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
            {loading ? 'Registrando...' : 'Registrar Administrador'}
          </button>
        </form>

        <p className="admin-login-hint">
          ¿Ya tienes cuenta?{' '}
          <a href="/admin" style={{ textDecoration: 'underline' }}>
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
