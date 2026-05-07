import { vi, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import BookingForm from '../../src/features/booking/BookingForm';
import * as api from '../../src/services/api';

vi.spyOn(api, 'postJSON').mockResolvedValue({ ok: true, data: { id: '123' } } as any);

test('submits valid booking', async () => {
  render(<BookingForm />);
  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
  fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+34123456789' } });
  fireEvent.change(screen.getByLabelText(/Fecha/i), { target: { value: '2026-06-01' } });
  fireEvent.change(screen.getByLabelText(/Servicio/i), { target: { value: 'cut' } });

  fireEvent.click(screen.getByRole('button', { name: /reservar/i }));

  await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/reserva recibida/i));
});
