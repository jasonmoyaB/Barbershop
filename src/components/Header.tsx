import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants/nav.constants';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../features/auth/AuthModal';

/**
 * Header — Single Responsibility: navigation + scroll-awareness
 * Open/Closed: nav links driven by data, not hard-coded JSX
 */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="container header-inner">
          <a href="#" className="brand" aria-label="Negro Barbershop — inicio">
            Negro Barbershop
          </a>
          <div className="header-nav-group">
            <nav aria-label="Navegación principal">
              <ul className="nav">
                {NAV_ITEMS.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {user ? (
              <div className="header-user">
                <span className="header-user-name">
                  {user.full_name || user.email}
                </span>
                {isAdmin && (
                  <a href="/admin" className="btn-admin" aria-label="Panel de administración">
                    Admin
                  </a>
                )}
                <button
                  onClick={() => signOut()}
                  className="btn-logout"
                  aria-label="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-login"
                aria-label="Iniciar sesión"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
