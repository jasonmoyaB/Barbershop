import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import type { BookingRecord } from '../booking/booking.types';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  }

  async function handleStatusUpdate(id: number, status: 'approved' | 'rejected') {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar: ' + error.message);
      return;
    }

    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status } : b)));
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);
    
    const matchesDate = filterDate === '' || booking.date === filterDate;
    
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return <div className="admin-loading">Cargando reservas...</div>;
  }

  return (
    <div className="admin-bookings">
      <div className="admin-bookings-header">
        <h2 className="admin-bookings-title">Gestión de Reservas</h2>
        <p className="admin-bookings-count">
          {filteredBookings.length} de {bookings.length} reservas
        </p>
      </div>

      <div className="admin-filters">
        <div className="admin-filter-group">
          <label htmlFor="search" className="admin-filter-label">Buscar</label>
          <input
            id="search"
            type="text"
            className="admin-filter-input"
            placeholder="Nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="admin-filter-group">
          <label htmlFor="date-filter" className="admin-filter-label">Fecha</label>
          <input
            id="date-filter"
            type="date"
            className="admin-filter-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        
        {(searchTerm || filterDate) && (
          <button
            className="admin-filter-clear"
            onClick={() => {
              setSearchTerm('');
              setFilterDate('');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="admin-empty">
          <p>No hay reservas que mostrar.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Creada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td>{new Date(booking.date).toLocaleDateString('es-ES')}</td>
                  <td>{booking.time}</td>
                  <td>{booking.service_id}</td>
                  <td>
                    <span className={`admin-status admin-status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{new Date(booking.created_at).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="admin-action-group">
                      <button
                        className="admin-btn-approve"
                        onClick={() => handleStatusUpdate(booking.id, 'approved')}
                        disabled={booking.status === 'approved'}
                      >
                        Aprobar
                      </button>
                      <button
                        className="admin-btn-reject"
                        onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                        disabled={booking.status === 'rejected'}
                      >
                        Rechazar
                      </button>
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDelete(booking.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
