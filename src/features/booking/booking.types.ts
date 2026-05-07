import type React from 'react';

export type BookingRequest = {
  name: string;
  phone: string;
  date: string; // ISO date
  serviceId: string;
  honeypot?: string;
};

export type BookingRecord = {
  id: number;
  name: string;
  phone: string;
  date: string;
  service_id: string;
  user_id: string | null;
  honeypot: string | null;
  created_at: string;
  updated_at: string;
};

export type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};
