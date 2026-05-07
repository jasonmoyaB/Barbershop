import React, { useState } from 'react';
import type { BookingRequest, FormFieldProps } from './booking.types';
import { validateBooking } from '../../utils/validate';
import { postJSON } from '../../services/api';
import { BOOKING_SERVICES, EMPTY_BOOKING_FORM } from '../../constants/booking.constants';

/* ─── FormField — Single Responsibility: render one labelled field ── */

function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

/* ─── BookingForm — Single Responsibility: form state + submission ── */

export default function BookingForm() {
  const [form, setForm]       = useState<BookingRequest>(EMPTY_BOOKING_FORM);
  const [errors, setErrors]   = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name as keyof BookingRequest]: value } as BookingRequest));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateBooking(form);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setLoading(true);
    const res = await postJSON<BookingRequest, { id: string }>('/api/bookings', form);
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    } else {
      setErrors([res.message ?? `Error ${res.status}`]);
    }
  }

  if (success) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <p className="form-success-title">Reserva recibida.</p>
        <p className="form-success-sub">Te contactaremos para confirmar tu cita.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="booking-form-title"
      noValidate
      className="booking-form"
    >
      {/* Honeypot anti-spam (visually hidden) */}
      <label style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        No rellenar
        <input
          name="honeypot"
          value={form.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <FormField label="Nombre" htmlFor="booking-name">
        <input
          id="booking-name"
          className="form-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          required
          autoComplete="name"
        />
      </FormField>

      <FormField label="Teléfono" htmlFor="booking-phone">
        <input
          id="booking-phone"
          className="form-input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="+34 600 000 000"
          required
          inputMode="tel"
          autoComplete="tel"
        />
      </FormField>

      <FormField label="Fecha" htmlFor="booking-date">
        <input
          id="booking-date"
          className="form-input"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </FormField>

      <FormField label="Servicio" htmlFor="booking-service">
        <select
          id="booking-service"
          className="form-select"
          name="serviceId"
          value={form.serviceId}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un servicio</option>
          {BOOKING_SERVICES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </FormField>

      <div className="form-actions">
        <button
          type="submit"
          className="form-submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Enviando…' : 'Reservar cita'}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="form-errors" role="alert" aria-live="assertive">
          <ul>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
    </form>
  );
}
