import React from 'react';
import type { Service, ServicesProps } from '../types/services.types';

export type { Service };

/**
 * Services — Single Responsibility: display service offerings
 * Open/Closed: services list is injected via props, not hard-coded
 */

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="section" aria-labelledby="services-heading">
      <div className="container">
        <p className="section-label" id="services-heading" aria-label="Sección: Servicios">
          Servicios
        </p>
        <div className="services-grid" role="list">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="service-item"
              role="listitem"
              aria-label={service.name}
            >
              <span className="service-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-desc">{service.description}</p>
              <span className="service-price">{service.price}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
