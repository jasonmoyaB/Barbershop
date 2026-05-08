import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { BOOKING_TIME_SLOTS } from '../../constants/booking.constants';

type WorkHour = {
  id: number;
  date: string;
  time: string;
  is_active: boolean;
};

type HoursState = {
  items: WorkHour[];
  loading: boolean;
  error: string;
};

const DAY_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
] as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  });
}

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

export default function AdminHours() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [state, setState] = useState<HoursState>({
    items: [],
    loading: true,
    error: '',
  });

  const byTime = useMemo(() => {
    const map = new Map<string, WorkHour>();
    state.items.forEach((item) => map.set(normalizeTime(item.time), item));
    return map;
  }, [state.items]);

  useEffect(() => {
    fetchHours();
  }, [selectedDate]);

  async function fetchHours() {
    setState((prev) => ({ ...prev, loading: true, error: '' }));

    const { data, error } = await supabase
      .from('work_hours')
      .select('*')
      .eq('date', selectedDate)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching work hours:', error);
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return;
    }

    setState({
      items: (data || []) as WorkHour[],
      loading: false,
      error: '',
    });
  }

  async function toggleSlot(time: string) {
    const key = normalizeTime(time);
    const existing = byTime.get(key);
    const nextValue = existing ? !existing.is_active : false;

    if (existing) {
      const { error } = await supabase
        .from('work_hours')
        .update({ is_active: nextValue })
        .eq('id', existing.id);

      if (error) {
        alert('No se pudo actualizar la hora: ' + error.message);
        return;
      }

      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === existing.id ? { ...item, is_active: nextValue } : item
        ),
      }));
      return;
    }

    const { data, error } = await supabase
      .from('work_hours')
      .upsert(
        { date: selectedDate, time, is_active: false },
        { onConflict: 'date,time' }
      )
      .select('*')
      .single();

    if (error) {
      alert('No se pudo crear la hora: ' + error.message);
      return;
    }

    setState((prev) => ({
      ...prev,
      items: [...prev.items, data as WorkHour],
    }));
  }

  const dayLabel = DAY_OPTIONS[new Date(selectedDate).getDay()]?.label ?? '';

  return (
    <div className="admin-hours">
      <div className="admin-hours-header">
        <div>
          <h2 className="admin-hours-title">Horas de trabajo</h2>
          <p className="admin-hours-subtitle">
            {dayLabel} · {formatDate(selectedDate)}
          </p>
        </div>
        <input
          type="date"
          className="admin-hours-date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />
      </div>

      {state.loading && <div className="admin-loading">Cargando horarios...</div>}

      {!state.loading && state.error && (
        <div className="admin-empty" role="alert">
          <p>No se pudieron cargar los horarios.</p>
          <button className="admin-filter-clear" onClick={fetchHours}>
            Reintentar
          </button>
        </div>
      )}

      {!state.loading && !state.error && (
        <div className="admin-hours-grid">
          {BOOKING_TIME_SLOTS.map((slot) => {
            const entry = byTime.get(slot);
            const isActive = entry ? entry.is_active : true;
            return (
              <button
                key={slot}
                className={`admin-hours-slot${isActive ? '' : ' is-inactive'}`}
                onClick={() => toggleSlot(slot)}
                type="button"
              >
                <span>{slot}</span>
                <span className="admin-hours-status">
                  {isActive ? 'Activo' : 'Inactivo'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
