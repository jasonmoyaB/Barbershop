import type { BookingRequest } from '../features/booking/booking.types';

export function validateBooking(input: BookingRequest): string[] {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length < 2) errors.push('Nombre inválido');
  const phoneRegex = /^\+?\d{7,15}$/;
  if (!phoneRegex.test(input.phone)) errors.push('Teléfono inválido');
  if (!input.date || Number.isNaN(Date.parse(input.date))) errors.push('Fecha inválida');
  if (!input.serviceId) errors.push('Selecciona un servicio');
  if (input.honeypot) errors.push('Spam detectado');
  return errors;
}
