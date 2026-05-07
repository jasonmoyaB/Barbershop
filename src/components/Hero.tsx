import React from 'react';
import type { HeroProps } from '../types/hero.types';

/**
 * Hero — Single Responsibility: brand statement + primary CTA
 * Centered, typographic, architectural
 */

export default function Hero({ name, tagline, location = 'Madrid' }: HeroProps) {
  return (
    <section className="hero" aria-label="Presentación">
      <div className="container hero-inner">
        <p className="hero-eyebrow">
          Barbería · {location}
        </p>

        <h1 className="hero-title">
          <span className="hero-title-accent">{name}</span>
        </h1>

        <p className="hero-subtitle">{tagline}</p>

        <div className="hero-actions">
          <a className="btn-primary" href="#book">
            Reservar
          </a>
          <a className="btn-ghost" href="#services">
            Servicios
          </a>
        </div>
      </div>
    </section>
  );
}
