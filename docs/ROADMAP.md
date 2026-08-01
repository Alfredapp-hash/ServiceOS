# ServiceOS Implementation Roadmap

## Current foundation

ServiceOS currently includes:

- Turborepo monorepo scaffold
- Next.js dashboard prototype
- Shared trade registry
- Industry customization profiles for HVAC, plumbing, electrical, roofing, garage doors, water treatment, and energy systems
- Settings screen for enabling and inspecting trade configurations
- Multi-tenant Supabase schema
- Customers, properties, assets, leads, jobs, quotes, invoices, payments, inventory, vehicles, GPS events, and tracking sessions
- Row-level security model
- Quote-builder financial foundation
- Arkhe backend-template reuse plan

## Product architecture

ServiceOS will use a shared operational core with configurable trade modules.

### Shared core

- Authentication and organization onboarding
- Role-based access control
- CRM
- Property digital twins
- Asset and equipment registry
- Leads and communications
- Scheduling and dispatch
- Technician GPS and arrival tracking
- Quote and proposal builder
- Pricebook
- Inventory and purchasing
- Jobs and work orders
- Invoices and payments
- Memberships
- Customer portal
- Reporting and analytics
- Audit logging
- Integrations

### Trade modules

Each trade contributes:

- Industry terminology
- Intake questions
- Asset schemas
- Inspection forms
- Diagnostic workflows
- Measurement fields
- Quote calculators
- Pricebook templates
- Compliance requirements
- Membership templates
- Automations
- Dashboard KPIs

## Delivery path

### Phase 1 — Make the platform real

Goal: a secure multi-tenant application that a contractor can sign into and configure.

1. Supabase project configuration
2. Authentication
3. Organization creation
4. Invitations and staff roles
5. Industry-selection onboarding
6. Persist organization trade settings
7. Seed industry defaults
8. Protected dashboard routes
9. Audit logging
10. Error monitoring and health checks

Exit criteria:

- A new owner can register, create a company, choose one or more trades, invite staff, and reach a configured dashboard.

### Phase 2 — CRM and property intelligence

Goal: create the permanent customer/property/system record.

1. Customer CRUD
2. Property CRUD
3. Contacts and billing relationships
4. Property access instructions
5. Asset/equipment CRUD
6. Trade-specific asset fields
7. Photos and documents
8. Service history timeline
9. Search and filtering
10. Customer and property import

Exit criteria:

- Staff can create a customer, property, and trade-specific assets and see a unified property history.

### Phase 3 — Leads, booking, and dispatch

Goal: move a lead into a scheduled and assigned job.

1. Lead intake
2. Online booking endpoint
3. Call and source attribution fields
4. Job creation
5. Calendar views
6. Unassigned-job queue
7. Technician availability
8. Drag-and-drop dispatch board
9. Status workflow
10. Notifications

Exit criteria:

- Office staff can receive a lead, create a job, schedule it, assign a technician, and notify the customer.

### Phase 4 — Technician mobile and GPS

Goal: support the full field-service visit.

1. Expo technician app
2. Authentication and device sessions
3. Daily schedule
4. Job details
5. Navigation launch
6. Start travel / arrive / begin / complete actions
7. Background GPS during authorized work states
8. Dispatcher live map
9. Signed customer arrival links
10. ETA notifications
11. Offline job data and sync
12. Photos, notes, signatures, and barcode scanning

Exit criteria:

- A technician can complete a basic job from the mobile app while the office and customer receive live status updates.

### Phase 5 — Quote builder and pricebook

Goal: turn diagnosis or inspection into an accurate, professional proposal.

1. Pricebook CRUD
2. Labor-rate configuration
3. Material costs
4. Overhead and burden rules
5. Target-margin pricing
6. Trade-specific quote calculators
7. Repair / restore / replace options
8. Good / better / best proposals
9. Photos, warranties, and financing blocks
10. Customer e-signature
11. SMS/email approval links
12. Quote versioning and audit history

Trade-specific priorities:

- HVAC: capacity, efficiency, refrigerant, equipment replacement
- Plumbing: fixtures, piping, water heaters, excavation
- Electrical: panels, circuits, permits, load calculations
- Roofing: squares, pitch, waste, tear-off, materials, supplements
- Garage doors: dimensions, springs, opener, hardware
- Water treatment: test results, equipment, consumables, delivery
- Energy systems: solar, storage, generators, interconnection

Exit criteria:

- A technician can build and present a margin-aware proposal and receive customer approval.

### Phase 6 — Work orders, inventory, and purchasing

Goal: connect sold work to labor, materials, trucks, and warehouses.

1. Work-order generation
2. Job tasks and checklists
3. Warehouse inventory
4. Truck inventory
5. Barcode-based consumption
6. Reservations
7. Transfers
8. Replenishment rules
9. Purchase orders
10. Receiving and returns
11. Supplier records
12. Inventory valuation and variance

Exit criteria:

- Materials used on a job update job cost and inventory automatically.

### Phase 7 — Billing, payments, and accounting

Goal: close the financial loop.

1. Invoice generation
2. Deposits and progress payments
3. Stripe payments
4. ACH
5. Refunds
6. Payment links
7. Accounts receivable
8. QuickBooks Online integration
9. Payment and deposit reconciliation
10. Job profitability
11. Commission calculations

Exit criteria:

- An approved job can become an invoice, receive payment, and sync to accounting.

### Phase 8 — Memberships and customer portal

Goal: increase recurring revenue and customer retention.

1. Membership builder
2. Entitlements and included visits
3. Recurring billing
4. Renewal and failed-payment workflows
5. Customer portal
6. Property and equipment history
7. Booking
8. Quotes and approvals
9. Invoices and payments
10. Warranties and documents
11. Arrival tracking

Exit criteria:

- Customers can manage their relationship with the contractor without calling the office.

### Phase 9 — Reporting and intelligence

Goal: deliver the market-killer operational layer.

1. Owner command center
2. Technician scorecards
3. True job profitability
4. Capacity utilization
5. Estimate close rates
6. Callback detection
7. Membership profitability
8. Inventory leakage
9. Lead-source profitability
10. Revenue forecasting
11. Equipment replacement scoring
12. Margin-aware dispatch recommendations
13. Capacity-aware marketing recommendations

Exit criteria:

- ServiceOS tells owners what requires action and explains the financial impact.

### Phase 10 — Contractor websites and growth engine

Goal: connect marketing demand directly to operations.

1. Website templates by trade
2. Service and service-area pages
3. Online booking
4. Emergency-service mode
5. Financing forms
6. Customer portal integration
7. Call tracking
8. Lead attribution
9. Review automation
10. Capacity-based offer recommendations
11. SEO content workflows
12. Multi-site management

Exit criteria:

- A contractor can run its customer-facing website and operating system from the same data platform.

## Immediate next sprint

The next sprint should focus only on Phase 1:

1. Configure Supabase environment variables
2. Add server and browser Supabase clients
3. Implement sign-up and sign-in
4. Add protected dashboard middleware
5. Build organization onboarding
6. Persist selected industries
7. Seed trade defaults into organization templates
8. Add staff invitation workflow
9. Add role checks
10. Add audit-event helpers

## Engineering rules

- Do not fork the product into seven separate applications.
- Keep trade behavior configuration-driven.
- Store organization overrides separately from system defaults.
- Every operational table must remain organization-scoped.
- Every write involving money, permissions, GPS, or customer approval must create an audit event.
- Customer tracking links must be temporary, signed, revocable, and job-specific.
- Continuous technician tracking must be limited to authorized working states.
- Quote calculations must store both cost and customer-price snapshots.
- Integration secrets must be encrypted and never exposed to browser code.
- Build the responsive web experience first, but preserve mobile/offline boundaries from the start.

## Recommended release sequence

- Internal alpha: HVAC + plumbing
- Design-partner alpha: HVAC + plumbing + electrical
- Private beta: add roofing and garage doors
- Public beta: add water treatment and energy systems

All seven modules remain represented in the architecture from the beginning; release sequencing controls validation and support burden, not code ownership.
