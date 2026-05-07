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
  serviceId: '',
  honeypot:  '',
};
