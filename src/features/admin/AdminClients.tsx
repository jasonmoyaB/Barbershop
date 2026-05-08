import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import type { UserProfile } from '../../types/user.types';

type ClientsState = {
  items: UserProfile[];
  loading: boolean;
  error: string;
};

export default function AdminClients() {
  const [state, setState] = useState<ClientsState>({
    items: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setState(prev => ({ ...prev, loading: true, error: '' }));

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .eq('role', 'user')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      return;
    }

    setState({
      items: (data || []) as UserProfile[],
      loading: false,
      error: '',
    });
  }

  if (state.loading) {
    return <div className="admin-loading">Cargando clientes...</div>;
  }

  return (
    <div className="admin-clients">
      <div className="admin-clients-header">
        <div>
          <h2 className="admin-clients-title">Clientes</h2>
          <p className="admin-clients-subtitle">
            {state.items.length} usuarios registrados
          </p>
        </div>
      </div>

      {state.error && (
        <div className="admin-empty" role="alert">
          <p>Hubo un problema cargando los clientes.</p>
          <button className="admin-filter-clear" onClick={fetchClients}>
            Reintentar
          </button>
        </div>
      )}

      {!state.error && state.items.length === 0 && (
        <div className="admin-empty">
          <p>No hay clientes para mostrar.</p>
        </div>
      )}

      {!state.error && state.items.length > 0 && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((client) => (
                <tr key={client.id}>
                  <td>{client.full_name || 'Sin nombre'}</td>
                  <td>{client.email}</td>
                  <td>{client.role}</td>
                  <td>{new Date(client.created_at).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
