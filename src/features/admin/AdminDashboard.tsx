import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import type { BookingRecord } from '../booking/booking.types';

type DashboardStats = {
  total: number;
  today: number;
  thisWeek: number;
  loading: boolean;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stats:', error);
      setStats((prev) => ({ ...prev, loading: false }));
      return;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];

    const todayCount = bookings.filter((b: BookingRecord) => b.date === today).length;
    const weekCount = bookings.filter((b: BookingRecord) => b.date >= weekStart).length;

    setStats({
      total: bookings.length,
      today: todayCount,
      thisWeek: weekCount,
      loading: false,
    });
  }

  if (stats.loading) {
    return <div className="admin-loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2 className="admin-dashboard-title">Dashboard</h2>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3 className="admin-stat-label">Total Reservas</h3>
          <p className="admin-stat-value">{stats.total}</p>
        </div>

        <div className="admin-stat-card">
          <h3 className="admin-stat-label">Hoy</h3>
          <p className="admin-stat-value">{stats.today}</p>
        </div>

        <div className="admin-stat-card">
          <h3 className="admin-stat-label">Esta Semana</h3>
          <p className="admin-stat-value">{stats.thisWeek}</p>
        </div>
      </div>

      <div className="admin-quick-links">
        <h3>Acceso Rápido</h3>
        <a href="/admin/bookings" className="admin-quick-link">
          Ver todas las reservas →
        </a>
      </div>
    </div>
  );
}
