import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants/nav.constants';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../features/auth/AuthModal';

/**
 * Header — Single Responsibility: navigation + scroll-awareness
 * Open/Closed: nav links driven by data, not hard-coded JSX
 * Mobile: hamburger menu
 */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="container header-inner">
          <a href="#" className="brand" aria-label="Negro Barbershop — inicio">
            Negro Barbershop
          </a>

          {/* Desktop Navigation */}
          <div className="header-nav-group desktop-nav">
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

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            className={`hamburger-menu${mobileMenuOpen ? ' active' : ''}`}
            onClick={handleMenuToggle}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <nav 
        className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}
        aria-label="Menú móvil"
      >
        <ul className="mobile-nav">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} onClick={handleNavClick}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Auth */}
        <div className="mobile-menu-auth">
          {user ? (
            <>
              <div className="mobile-user-info">
                <span>{user.full_name || user.email}</span>
              </div>
              {isAdmin && (
                <a href="/admin" className="btn-mobile-admin" onClick={handleNavClick}>
                  Admin
                </a>
              )}
              <button 
                onClick={() => { signOut(); setMobileMenuOpen(false); }} 
                className="btn-mobile-logout"
              >
                Salir
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} 
              className="btn-mobile-login"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
