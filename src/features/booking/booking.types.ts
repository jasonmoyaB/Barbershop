export type BookingRequest = {
  name: string;
  phone: string;
  date: string; // ISO date
  serviceId: string;
  honeypot?: string;
};
