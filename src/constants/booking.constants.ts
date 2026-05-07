import type { BookingRequest } from '../features/booking/booking.types';

export const BOOKING_SERVICES = [
  { value: 'cut',   label: 'Corte' },
  { value: 'beard', label: 'Barba' },
  { value: 'combo', label: 'Corte + Barba' },
] as const;

export const EMPTY_BOOKING_FORM: BookingRequest = {
  name:      '',
  phone:     '',
  date:      '',
  time:      '',
  serviceId: '',
  honeypot:  '',
};

export const BOOKING_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
] as const;
