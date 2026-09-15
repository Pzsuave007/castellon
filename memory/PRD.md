# Castellon Septic Services — PRD

## Original Problem Statement
Premium high-converting website + booking platform for Castellon Septic Services (Spokane, WA · 509-655-6480). Industrial / heavy-duty aesthetic with "Premium del truck" theme (Forest Green, Cream, Sky Blue, Lime — matching the client's actual truck). Service area: Spokane and Eastern Washington, ~2-hour radius. Four primary services: Residential Septic, Commercial Septic, Restaurant Grease Trap, Emergency Pump-Out. Customer-facing booking calendar with available slots filtered by service type. Owner admin dashboard with bookings calendar + quote requests + availability settings.

## Architecture
- **Frontend**: React 19 + Tailwind + shadcn/ui (Tabs, Accordion, Dialog). Routes: `/`, `/book`, `/quote`, `/services/:slug`, `/areas/:slug`, `/admin/login`, `/admin`. Fonts: Teko (display) + IBM Plex Sans (body).
- **Backend**: FastAPI + Motor (async Mongo). JWT auth (HS256, 8h), bcrypt-hashed admin seeded from env on startup.
- **DB collections**: `users`, `bookings`, `quotes`, `availability` (single `_id="config"` doc).
- **Auth**: cookie + Authorization Bearer header fallback. Admin role required on `/api/admin/*`.
- **Deployment**: cPanel via `deploy.sh` + `bootstrap.sh`. Uvicorn on port 8011, Apache `.htaccess` proxy. Domain: `castellonsepticservices.com`.

## User Personas
- **Homeowner / property manager**: needs septic service, wants to book online or call fast.
- **Restaurant owner**: wants recurring grease trap maintenance contract.
- **Emergency caller**: septic backup — needs immediate phone contact.
- **Owner (admin)**: schedules calendar, processes quote requests, configures availability.

## Core Requirements (Static)
- Industrial premium landing page with 9 marketing sections + floating CTAs.
- Public booking flow with calendar + slot selection per service.
- Public quote request form.
- Individual service detail pages + city/area SEO pages.
- Admin dashboard: bookings calendar (color-coded by service), quote queue, availability config.
- JWT-secured admin endpoints.

## Implemented
### 2026-02 (initial MVP)
- Marketing landing page (hero, trust, services, area, why-choose, contracts, emergency, reviews, FAQ, final CTA, floating CTAs)
- 4-step booking wizard (service → date+slot → info → confirmation)
- Quote request form
- Admin login + dashboard with 3 tabs (Bookings Calendar, Quote Requests, Availability)
- Availability config (working days / hours / slot duration / blocked dates)
- Booking conflict prevention (per date+time, non-emergency)
- 4 dedicated service pages + city/area SEO pages
- Custom hand-coded SVG logos (client rejected AI-generated logos)
- "Premium del truck" theme (Forest Green, Cream, Sky Blue, Lime)
- cPanel deployment scripts (`deploy.sh`, `bootstrap.sh`, `install_server.sh`)
- All images local-hosted (no S3/3rd-party latency)
- Tested end-to-end: backend 100% (10/10), frontend 100%

### 2026-02-15 (scope adjustments)
- Removed all Idaho references and dedicated Idaho city pages (Coeur d'Alene, Post Falls, Hayden, Sandpoint, Rathdrum) — client cannot service Idaho
- Removed public email from footer
- Updated phone number site-wide from `509-389-6138` → `509-655-6480`
- Service Area section restructured to Washington-only (Spokane, Spokane Valley, Cheney, Deer Park)
- Updated meta description, title, FAQ, reviews, and all copy to reflect Eastern Washington only

## Prioritized Backlog
- **P1**: Email notifications on new booking & new quote (Resend) — needs API key
- **P2**: SMS notifications for emergency bookings (Twilio) — needs API key
- **P2**: Google Maps embed for service area
- **P2**: Google Business Reviews integration
- **P2**: Stripe integration for $50 emergency deposit
- **P2**: SEO structured data (LocalBusiness schema) + sitemap.xml
- **P3**: Customer login/portal to view booking history
- **P3**: Owner mobile shortcut for one-click "mark completed"
- **P3**: Recurring maintenance contract management (auto-schedule quarterly grease-trap visits)

## Test Credentials
- Admin: `admin@castellonsepticservices.com` / `Catellon2026!` (fallback: `admin@catellon.com`)

