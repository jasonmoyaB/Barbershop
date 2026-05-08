import { vi, test, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import BookingForm from '../../src/features/booking/BookingForm';

const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@test.com', full_name: 'Test User', role: 'user' as const };

vi.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, isLoading: false, signOut: async () => {}, isAdmin: false, isUser: true }),
}));

test('renders booking form with all fields', () => {
  render(
    <BrowserRouter>
      <BookingForm />
    </BrowserRouter>
  );

  const nameInput = screen.getByLabelText(/Nombre/i);
  const phoneInput = screen.getByLabelText(/Teléfono/i);
  const dateInput = screen.getByLabelText(/Fecha/i);
  const timeInput = screen.getByLabelText(/Hora/i);
  const serviceInput = screen.getByLabelText(/Servicio/i);
  const submitButton = screen.getByRole('button', { name: /reservar/i });

  expect(nameInput).toBeDefined();
  expect(phoneInput).toBeDefined();
  expect(dateInput).toBeDefined();
  expect(timeInput).toBeDefined();
  expect(serviceInput).toBeDefined();
  expect(submitButton).toBeDefined();
});