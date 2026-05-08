import React, { useEffect, useState } from 'react';
import type { BookingRequest, FormFieldProps } from './booking.types';
import { validateBooking } from '../../utils/validate';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  BOOKING_SERVICES,
  BOOKING_TIME_SLOTS,
  EMPTY_BOOKING_FORM,
} from '../../constants/booking.constants';

/* ─── FormField — Single Responsibility: render one labelled field ── */

function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── BookingForm — Single Responsibility: form state + submission ── */

export default function BookingForm() {
  const [form, setForm] = useState<BookingRequest>(EMPTY_BOOKING_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSlotChecking, setIsSlotChecking] = useState(false);
  const [inactiveSlots, setInactiveSlots] = useState<Set<string>>(new Set());
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!form.date) {
      setInactiveSlots(new Set());
      return;
    }

    void fetchInactiveSlots(form.date);
  }, [form.date]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof BookingRequest]: value } as BookingRequest));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(['El archivo no puede exceder 5MB']);
        setReceiptFile(null);
        return;
      }
      const allowedTypes = ['image/', 'application/pdf'];
      const isAllowed = allowedTypes.some(
        (type) => file.type.startsWith(type) || type === file.type,
      );
      if (!isAllowed) {
        setErrors(['Solo se permiten imágenes o PDF']);
        setReceiptFile(null);
        return;
      }
      setReceiptFile(file);
      setErrors([]);
    } else {
      setReceiptFile(null);
    }
  }

  async function isSlotAvailable() {
    if (!form.date || !form.time) return true;
    setIsSlotChecking(true);
    const { data: availability, error: availabilityError } = await supabase
      .from('work_hours')
      .select('is_active')
      .eq('date', form.date)
      .eq('time', form.time)
      .maybeSingle();

    if (availabilityError) {
      setErrors([availabilityError.message || 'Error al validar disponibilidad']);
      setIsSlotChecking(false);
      return false;
    }

    if (availability && availability.is_active === false) {
      setErrors(['La hora seleccionada no está disponible']);
      setIsSlotChecking(false);
      return false;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', form.date)
      .eq('time', form.time)
      .limit(1);
    setIsSlotChecking(false);
    if (error) {
      setErrors([error.message || 'Error al validar disponibilidad']);
      return false;
    }
    return !data || data.length === 0;
  }

  async function fetchInactiveSlots(date: string) {
    const { data, error } = await supabase
      .from('work_hours')
      .select('time, is_active')
      .eq('date', date);

    if (error) {
      console.error('Error fetching availability:', error);
      setInactiveSlots(new Set());
      return;
    }

    const nextInactive = new Set<string>();
    (data || []).forEach((row: { time: string; is_active: boolean }) => {
      if (row.is_active === false) {
        nextInactive.add(row.time.slice(0, 5));
      }
    });

    setInactiveSlots(nextInactive);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check authentication
    if (!user) {
      setErrors(['Debes iniciar sesión para reservar una cita']);
      return;
    }

    const validationErrors = validateBooking(form);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    const slotAvailable = await isSlotAvailable();
    if (!slotAvailable) {
      if (errors.length === 0) {
        setErrors(['La hora seleccionada ya está ocupada']);
      }
      return;
    }
    setLoading(true);

    let receiptUrl: string | null = null;

    if (receiptFile && user) {
      const fileName = `${user.id}/${Date.now()}_${receiptFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile, { upsert: true });

      if (uploadError) {
        setErrors(['Error al subir el comprobante: ' + uploadError.message]);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
      receiptUrl = urlData.publicUrl;
    }

    // Map form fields to database columns
    const { error } = await supabase.from('bookings').insert({
      name: form.name,
      phone: form.phone,
      date: form.date,
      service_id: form.serviceId,
      time: form.time,
      user_id: user.id,
      honeypot: form.honeypot || null,
      receipt_url: receiptUrl,
    });

    setLoading(false);

    if (error) {
      setErrors([error.message || 'Error al enviar la reserva']);
    } else {
      setSuccess(true);
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
      <label
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
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

      <FormField label="Hora" htmlFor="booking-time">
        <select
          id="booking-time"
          className="form-select"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una hora</option>
          {BOOKING_TIME_SLOTS.map((slot) => {
            const isInactive = inactiveSlots.has(slot);
            return (
              <option key={slot} value={slot} disabled={isInactive}>
                {slot} {isInactive ? '— No disponible' : '— Disponible'}
              </option>
            );
          })}
        </select>
        {form.date && inactiveSlots.size > 0 && (
          <p className="booking-slot-hint">
            Las horas marcadas como no disponibles no se pueden reservar.
          </p>
        )}
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
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Comprobante de pago" htmlFor="booking-receipt">
        <input
          id="booking-receipt"
          type="file"
          name="receipt"
          accept="image/*,.pdf"
          className="form-file-input"
          onChange={handleFileChange}
        />
        <span className="form-hint">Máximo 5MB. Imagen o PDF.</span>
      </FormField>

      <div className="form-actions">
        <button
          type="submit"
          className="form-submit"
          disabled={loading || isSlotChecking}
          aria-busy={loading || isSlotChecking}
        >
          {loading ? 'Enviando…' : isSlotChecking ? 'Validando…' : 'Reservar cita'}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="form-errors" role="alert" aria-live="assertive">
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
