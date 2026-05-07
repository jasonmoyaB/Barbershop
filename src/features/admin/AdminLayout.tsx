import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-header-title">Admin - Negro Barbershop</h1>
          <nav className="admin-nav">
            <Link to="/admin" className="admin-nav-link">Dashboard</Link>
            <Link to="/admin/bookings" className="admin-nav-link">Reservas</Link>
            <button onClick={handleLogout} className="admin-logout-btn">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="admin-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
