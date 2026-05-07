import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants/nav.constants';

/**
 * Header — Single Responsibility: navigation + scroll-awareness
 * Open/Closed: nav links driven by data, not hard-coded JSX
 */

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} role="banner">
      <div className="container header-inner">
        <a href="#" className="brand" aria-label="Negro Barbershop — inicio">
          Negro Barbershop
        </a>
        <nav aria-label="Navegación principal">
          <ul className="nav">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
