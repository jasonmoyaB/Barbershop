import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingForm from './features/booking/BookingForm';
import Footer from './components/Footer';
import { SERVICES, SOCIAL_LINKS } from './constants/app.constants';

/* ─── Static data lives in constants/app.constants.ts — Dependency Inversion ── */

export default function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <Hero
          name="Negro Barbershop"
          tagline="Cortes de precisión y afeitados clásicos en Paraíso, Cartago."
          location="Paraíso, Cartago"
        />

        <Services services={SERVICES} />

        <section id="book" className="section" aria-labelledby="booking-form-title">
          <div className="container">
            <p className="section-label">Reservar</p>
            <div className="booking-layout">
              <div>
                <h2 id="booking-form-title" className="booking-info-title">
                  Reserva tu<br />
                  <em>próxima cita.</em>
                </h2>
                <p className="booking-info-body">
                  Elige tu servicio, selecciona la fecha y te confirmamos en menos de 24 horas.
                  Sin tarjeta de crédito ni registros innecesarios.
                </p>
                <ul className="booking-info-meta" aria-label="Horario e información">
                  <li className="booking-meta-item">Lun – Sáb, 09:00 – 20:00</li>
                  <li className="booking-meta-item">Paraíso, Cartago, Costa Rica</li>
                  <li className="booking-meta-item">+34 123 456 789</li>
                </ul>
              </div>
              <BookingForm />
            </div>
          </div>
        </section>
      </main>

      <Footer phone="+34 123 456 789" socialLinks={SOCIAL_LINKS} />
    </div>
  );
}
