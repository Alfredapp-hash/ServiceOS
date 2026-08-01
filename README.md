# ServiceOS

ServiceOS is a multi-trade operating system for residential and light-commercial property service companies.

## Launch trades

- HVAC
- Plumbing
- Electrical
- Roofing
- Garage door service
- Water treatment and filtration
- Energy systems: solar, battery, and generator service

## Product foundation

The shared core covers CRM, properties, assets, leads, scheduling, dispatch, GPS, quotes, jobs, invoices, payments, inventory, fleet, memberships, websites, customer portals, analytics, and integrations. Trade modules provide specialized assets, forms, pricebooks, compliance records, and workflows.

## Repository structure

```text
apps/dashboard       Office command center and settings prototype
packages/trades      Shared launch trade registry
modules/*            Future trade-specific schemas and workflow packages
packages/*           Future quote, maps, database, auth, UI, and integration packages
```

## Recommended production stack

- Next.js + React + TypeScript
- Turborepo + pnpm workspaces
- Tailwind CSS + shadcn/ui
- NestJS API services
- PostgreSQL + Prisma
- Supabase Auth, Storage, and Realtime
- Redis + BullMQ
- Temporal for durable long-running workflows
- React Native + Expo technician app
- Mapbox or Google Maps for GPS, geofencing, routing, and customer arrival links
- Stripe for payments
- Twilio for voice and SMS
- Postmark for transactional email
- Cloudflare R2 for photos, videos, documents, and inspection media
- OpenTelemetry + Sentry for observability

## Run the current scaffold

```bash
pnpm install
pnpm dev
```

The dashboard runs from `apps/dashboard` and currently demonstrates trade selection, margin-aware quote calculations, operational KPIs, and the dispatch/GPS integration boundary.

## Immediate build sequence

1. Database and tenant isolation
2. Authentication, onboarding, and role permissions
3. Customer, property, and asset records
4. Quote builder and trade pricebooks
5. Scheduling and dispatch board
6. Technician mobile app and background GPS
7. Secure customer arrival tracking links
8. Inventory, fleet, accounting, and payments
9. Trade-specific forms and workflows
