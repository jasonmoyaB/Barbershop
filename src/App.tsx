import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services, { type Service } from './components/Services';
import BookingForm from './features/booking/BookingForm';
import Footer from './components/Footer';

/* ─── Static data — Dependency Inversion: App owns data, injects it ── */

const SERVICES: Service[] = [
  {
    id: 'cut',
    name: 'Corte',
    description: 'Corte de precisión adaptado a tu estilo. Técnica de tijera o máquina, con acabado y moldeado incluidos.',
    price: 'desde 18 €',
  },
  {
    id: 'beard',
    name: 'Barba',
    description: 'Perfilado y arreglo de barba con navaja clásica, vapor caliente y bálsamo hidratante de acabado.',
    price: 'desde 12 €',
  },
  {
    id: 'combo',
    name: 'Corte + Barba',
    description: 'Servicio completo de corte y arreglo de barba. La experiencia definitiva del cuidado masculino.',
    price: 'desde 28 €',
  },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook',  href: '#' },
];

export default function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <Hero
          name="El Corte"
          tagline="Cortes de precisión y afeitados clásicos desde 1985."
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
                  <li className="booking-meta-item">Calle del Ejemplo 12, Madrid</li>
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
