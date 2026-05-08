# PRD

## Project Summary
El Corte is a Spanish-language barber shop web app built with React 18, TypeScript, and Vite. It includes a public landing page, booking flow, and an admin area for managing business data.

## What The App Does
- Presents the barber shop brand and services to visitors.
- Lets customers submit booking requests from the public site.
- Provides an authenticated admin section for operational management.
- Works as a frontend-only PWA with offline support and installability.

## Main Features
- Public homepage with hero, services, booking form, and footer.
- Booking form that submits to `/api/bookings`.
- Authentication context and protected admin routes.
- Admin pages for dashboard, bookings, clients, hours, and registration.
- PWA support through manifest, service worker, and offline fallback.

## What TestSprite Should Test
- Public page rendering on the home route.
- Navigation and routing behavior.
- Booking form validation and submit flow.
- Admin route protection and redirect behavior.
- Admin page rendering for the main sections.
- PWA readiness at a basic level, including install/offline assets where applicable.

## Notes For Testing
- The booking endpoint does not exist in this repo, so submit tests should expect a network failure unless the backend is mocked.
- TestSprite should prioritize user-visible flows over internal implementation details.
