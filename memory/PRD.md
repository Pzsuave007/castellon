# Catellon Septic Services — PRD

## Original Problem Statement
Premium high-converting website + booking platform for Catellon Septic Services (Spokane, WA · 509-389-6138). Industrial / heavy-duty aesthetic. Deep navy + steel gray + amber accent. Service area: Eastern WA + North ID, ~2-hour radius. Four primary services: Residential Septic, Commercial Septic, Restaurant Grease Trap, Emergency Pump-Out. Customer-facing booking calendar with available slots filtered by service type. Owner admin dashboard with bookings calendar + quote requests + availability settings.

## Architecture
- **Frontend**: React 19 + Tailwind + shadcn/ui (Tabs, Accordion, Dialog). Routes: `/`, `/book`, `/quote`, `/admin/login`, `/admin`. Fonts: Teko (display) + IBM Plex Sans (body).
- **Backend**: FastAPI + Motor (async Mongo). JWT auth (HS256, 8h), bcrypt-hashed admin seeded from env on startup.
- **DB collections**: `users`, `bookings`, `quotes`, `availability` (single `_id="config"` doc).
- **Auth**: cookie + Authorization Bearer header fallback. Admin role required on `/api/admin/*`.

## User Personas
- **Homeowner / property manager**: needs septic service, wants to book online or call fast.
- **Restaurant owner**: wants recurring grease trap maintenance contract.
- **Emergency caller**: septic backup — needs immediate phone contact.
- **Owner (admin)**: schedules calendar, processes quote requests, configures availability.

## Core Requirements (Static)
- Industrial premium landing page with 9 marketing sections + floating CTAs.
- Public booking flow with calendar + slot selection per service.
- Public quote request form.
- Admin dashboard: bookings calendar (color-coded by service), quote queue, availability config.
- JWT-secured admin endpoints.

## Implemented (2026-02)
- Marketing landing page (hero, trust, services, area, why-choose, contracts, emergency, reviews, FAQ, final CTA, floating CTAs)
- 4-step booking wizard (service → date+slot → info → confirmation)
- Quote request form
- Admin login + dashboard with 3 tabs (Bookings Calendar, Quote Requests, Availability)
- Availability config (working days / hours / slot duration / blocked dates)
- Booking conflict prevention (per date+time, non-emergency)
- Tested end-to-end: backend 100% (10/10), frontend 100%

## Prioritized Backlog
- **P1**: Email/SMS notifications on new booking & new quote (Resend or Twilio) — needs API key
- **P1**: Real Google Maps embed for service area + Google Business Reviews API
- **P2**: Stripe integration to take a card deposit for emergency bookings (revenue uplift)
- **P2**: SEO meta tags + sitemap + structured data for local search
- **P2**: Customer login/portal to view booking history
- **P3**: Owner mobile shortcut for one-click "mark completed" on day-of jobs
- **P3**: Recurring maintenance contract management (auto-schedule monthly grease-trap visits)

## Test Credentials
- Admin: `admin@catellon.com` / `Catellon2026!`
