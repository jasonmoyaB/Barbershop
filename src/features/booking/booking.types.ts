import type React from 'react';

export type BookingRequest = {
  name: string;
  phone: string;
  date: string; // ISO date
  time: string; // HH:mm
  serviceId: string;
  honeypot?: string;
  receiptUrl?: string;
};

export type BookingRecord = {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  service_id: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string | null;
  honeypot: string | null;
  created_at: string;
  updated_at: string;
  receipt_url?: string;
};

export type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};
