import React from 'react';

/**
 * Footer — Single Responsibility: copyright + social links
 * Open/Closed: social links injected via props
 */

type SocialLink = {
  label: string;
  href: string;
};

type FooterProps = {
  phone: string;
  socialLinks: SocialLink[];
};

export default function Footer({ phone, socialLinks }: FooterProps) {
  return (
    <footer id="contact" className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} El Corte &mdash;{' '}
          <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        </p>
        <nav aria-label="Redes sociales">
          <ul className="social">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
