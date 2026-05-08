import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { BookingRecord } from './booking.types';

type AppointmentsState = {
  items: BookingRecord[];
  loading: boolean;
  error: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

export default function MyAppointments() {
  const { user } = useAuth();
  const [state, setState] = useState<AppointmentsState>({
    items: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (!user) {
      setState({ items: [], loading: false, error: '' });
      return;
    }

    fetchAppointments();
  }, [user]);

  async function fetchAppointments() {
    if (!user) return;

    setState((prev) => ({ ...prev, loading: true, error: '' }));

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return;
    }

    setState({
      items: (data || []) as BookingRecord[],
      loading: false,
      error: '',
    });
  }

  if (!user) {
    return (
      <section className="my-appointments" aria-live="polite">
        <div className="my-appointments-card">
          <h3 className="my-appointments-title">Mis citas</h3>
          <p className="my-appointments-subtitle">Inicia sesión para ver el estado de tus citas.</p>
        </div>
      </section>
    );
  }

  if (state.loading) {
    return (
      <section className="my-appointments" aria-live="polite">
        <div className="my-appointments-card">
          <h3 className="my-appointments-title">Mis citas</h3>
          <p className="my-appointments-subtitle">Cargando tus citas...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-appointments" aria-live="polite">
      <div className="my-appointments-header">
        <div>
          <h3 className="my-appointments-title">Mis citas</h3>
          <p className="my-appointments-subtitle">{state.items.length} citas registradas</p>
        </div>
        <button className="my-appointments-refresh" onClick={fetchAppointments}>
          Actualizar
        </button>
      </div>

      {state.error && (
        <div className="my-appointments-empty" role="alert">
          <p>No pudimos cargar tus citas.</p>
          <button className="my-appointments-refresh" onClick={fetchAppointments}>
            Reintentar
          </button>
        </div>
      )}

      {!state.error && state.items.length === 0 && (
        <div className="my-appointments-empty">
          <p>Todavía no tienes citas registradas.</p>
        </div>
      )}

      {!state.error && state.items.length > 0 && (
        <div className="my-appointments-grid">
          {state.items.slice(0, 3).map((appointment) => (
            <article key={appointment.id} className="my-appointments-item">
              <div className="my-appointments-meta">
                <p className="my-appointments-date">
                  {new Date(appointment.date).toLocaleDateString('es-ES')}
                </p>
                <p className="my-appointments-time">{appointment.time}</p>
              </div>
              <p className="my-appointments-service">Servicio: {appointment.service_id}</p>
              <span
                className={`my-appointments-status my-appointments-status-${
                  appointment.status || 'pending'
                }`}
              >
                {STATUS_LABELS[appointment.status] || 'Pendiente'}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
