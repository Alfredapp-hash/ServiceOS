# Arkhe Backend Template Reuse Plan

The uploaded Arkhe backend template is a hardened marketing, CRM, and administration foundation. ServiceOS should reuse its infrastructure patterns selectively rather than import the entire application or its marine-specific public content.

## Reuse directly or adapt closely

### Authentication and authorization

Adapt:

- Supabase SSR browser and server clients
- Login and auth confirmation flow
- Middleware route protection
- Staff-role checks
- Inactivity logout

ServiceOS extension:

- Replace single-site staff roles with organization membership and branch-scoped permissions.
- Preserve the principle of centralized `requireStaff` and `requireStaffApi` helpers.

### Audit logging

Adapt:

- Administrative audit-log table and API structure
- Mutation logging helper
- Audit-log admin view

ServiceOS events should include:

- Industry enabled or disabled
- Quote or pricebook changes
- Dispatch reassignment
- GPS tracking link created or revoked
- Customer data export
- Payment adjustment
- Inventory adjustment
- Permission changes

### Integrations and encrypted credentials

Adapt:

- Connector registry
- Encrypted secret storage
- OAuth PKCE helpers
- Integration status page
- Diagnostic endpoints

ServiceOS connector categories:

- Accounting
- Payments and financing
- Communications
- Mapping and fleet
- Suppliers
- Roofing measurement
- Marketing and reviews
- Utility and manufacturer systems

### Rate limiting and form security

Adapt:

- Rate-limit helpers
- Upload validation
- HTML sanitization
- Safe redirect handling
- Public-form validation

Apply to:

- Customer tracking links
- Public booking
- Quote approval
- Payment links
- Lead forms
- File and inspection uploads
- Webhooks

### Email and communications

Adapt:

- Branded transactional email layout
- Plain-text fallbacks
- Delivery abstraction
- Contact capture
- Resend integration

ServiceOS templates:

- Booking confirmation
- Technician on-the-way link
- Estimate and proposal
- Payment receipt
- Membership renewal
- Warranty registration
- Inspection report
- Permit or project update

### Monitoring and health

Adapt:

- Sentry configuration
- OpenTelemetry hooks
- Health endpoint
- Integration smoke tests
- Monitoring capture utilities

### Attribution, reviews, SEO, and promotions

Adapt as shared optional modules:

- UTM attribution
- Call/form source tracking
- Google review ingestion
- Review-request workflow
- SEO center patterns
- Promotions engine
- Blog Studio and social publisher for contractor websites

These modules should be enabled by plan and role, not mixed into core dispatch logic.

## Do not copy directly

- Marine inventory, financing, parts, or service-specific schemas
- Existing public homepage and media
- Marine lead types
- Single-business assumptions in settings
- Leftover Lightspeed or dealer workflows

## ServiceOS module boundaries

```text
Core operations
  CRM · property · assets · jobs · dispatch · GPS · quotes · invoices · payments

Trade configuration
  HVAC · plumbing · electrical · roofing · garage doors · water treatment · energy systems

Growth platform
  websites · leads · SEO · reviews · promotions · blog · social · attribution

System platform
  auth · permissions · integrations · audit · monitoring · email · security
```

## Architectural rule

Trade modules supply configuration and domain rules. They must not fork the core customer, property, job, dispatch, quote, invoice, or payment implementations.
