import type React from 'react';

export type BookingRequest = {
  name: string;
  phone: string;
  date: string; // ISO date
  serviceId: string;
  honeypot?: string;
};

export type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};
