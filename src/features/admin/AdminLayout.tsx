import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout admin-shell">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-label">Panel</span>
          <span className="admin-brand-name">Negro Barbershop</span>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Navegación principal">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-sidebar-link${isActive ? ' is-active' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `admin-sidebar-link${isActive ? ' is-active' : ''}`
            }
          >
            Reservas
          </NavLink>
          <NavLink
            to="/admin/clients"
            className={({ isActive }) =>
              `admin-sidebar-link${isActive ? ' is-active' : ''}`
            }
          >
            Clientes
          </NavLink>
          <NavLink
            to="/admin/hours"
            className={({ isActive }) =>
              `admin-sidebar-link${isActive ? ' is-active' : ''}`
            }
          >
            Horarios
          </NavLink>
        </nav>

        <div className="admin-sidebar-meta">
          <p className="admin-sidebar-caption">Acceso restringido</p>
          <button onClick={handleLogout} className="admin-logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header with Hamburger */}
      <header className="admin-header-mobile">
        <a href="/admin" className="admin-brand-mobile">
          <span className="admin-brand-label">Panel</span>
          <span className="admin-brand-name">Negro Barbershop</span>
        </a>

        <button
          className={`hamburger-menu${mobileMenuOpen ? ' active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setMobileMenuOpen(false)}
          tabIndex={-1}
        ></div>
      )}

      {/* Mobile Menu */}
      <nav 
        className={`admin-mobile-menu${mobileMenuOpen ? ' open' : ''}`}
        aria-label="Menú administración"
      >
        <NavLink
          to="/admin"
          end
          onClick={handleNavClick}
          className={({ isActive }) =>
            `admin-mobile-link${isActive ? ' is-active' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/bookings"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `admin-mobile-link${isActive ? ' is-active' : ''}`
          }
        >
          Reservas
        </NavLink>
        <NavLink
          to="/admin/clients"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `admin-mobile-link${isActive ? ' is-active' : ''}`
          }
        >
          Clientes
        </NavLink>
        <NavLink
          to="/admin/hours"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `admin-mobile-link${isActive ? ' is-active' : ''}`
          }
        >
          Horarios
        </NavLink>

        <div className="admin-mobile-divider"></div>

        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="admin-mobile-logout">
          Cerrar Sesión
        </button>
      </nav>

      <div className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-title">Administración</div>
          <div className="admin-topbar-pill">En línea</div>
        </header>

        <main className="admin-main">
          <div className="admin-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
