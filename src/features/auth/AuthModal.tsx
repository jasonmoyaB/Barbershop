import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultView?: 'login' | 'register';
};

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultView = 'login',
}: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  if (!isOpen) return null;

  function handleSuccess() {
    onSuccess();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {view === 'login' ? (
          <>
            <Login onSuccess={handleSuccess} onCancel={onClose} />
            <p className="auth-toggle">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setView('register')}
              >
                Regístrate aquí
              </button>
            </p>
          </>
        ) : (
          <>
            <Register onSuccess={handleSuccess} onCancel={onClose} />
            <p className="auth-toggle">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setView('login')}
              >
                Inicia sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
