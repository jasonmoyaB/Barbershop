import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <div className="admin-layout admin-shell">
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
