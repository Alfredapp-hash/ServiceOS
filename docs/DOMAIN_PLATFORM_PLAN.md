# ServiceOS Domain-First Platform Plan

## Architectural rule

All feature code follows this dependency direction:

```text
Controller / Transport
  -> Application command or query handler
    -> Domain model and policy
      -> Repository interface
        -> Infrastructure adapter
          -> PostgreSQL, Redis, Service Bus, Azure provider
```

The domain layer must not import NestJS, Prisma, Azure SDKs, HTTP types, or database-generated models.

## Tenant isolation

Every application command and query carries an explicit `RequestContext` containing `organizationId`, `userId`, roles, and correlation ID.

Every tenant-owned aggregate includes an `organizationId`.

Every repository method requires tenant context. Database row-level security remains a second enforcement boundary rather than the only boundary.

Cross-organization access must fail before business data is returned.

## Canonical hierarchy

```text
Organization
  -> Locations
    -> Customers
      -> Properties
        -> Assets
          -> Work Orders
            -> Visits
              -> Quotes
              -> Invoices
                -> Payments
```

A customer may own or manage multiple properties. A property may contain assets from several enabled industries.

## Packages

- `@serviceos/core`: domain primitives, tenant context, errors, repository boundaries.
- `@serviceos/contracts`: application commands, queries, and transport-neutral DTO contracts.
- `@serviceos/events`: versioned domain-event contracts and metadata envelope.
- `@serviceos/providers`: cloud and external-service interfaces.
- `@serviceos/database`: PostgreSQL client and persistence adapters.
- `@serviceos/trades`: industry modules, forms, quote rules, assets, and KPI configuration.

Future packages:

- `@serviceos/config`
- `@serviceos/observability`
- `@serviceos/shared`
- `@serviceos/testing`

## Provider boundaries

Business logic may depend on provider interfaces only. Azure implementations will live under infrastructure adapters.

Provider interfaces include authentication, AI, email, SMS, notifications, maps, storage, secrets, payments, events, logging, feature flags, search, cache, and observability.

Redis is limited to ephemeral concerns:

- Rate limiting
- Session cache
- Live technician positions
- Presence
- Temporary tracking tokens
- Response caching
- Distributed locks

Redis must not be the source of truth for customers, properties, work orders, quotes, invoices, or payments.

## Event rules

Events are defined before producers and consumers are implemented.

Every event carries:

- Globally unique event ID
- Event name
- Schema version
- Occurrence timestamp
- Organization ID
- Optional actor ID
- Correlation and causation IDs
- Typed payload

Initial events:

- OrganizationCreated
- UserInvited
- CustomerCreated
- PropertyCreated
- WorkOrderCreated
- TechnicianAssigned
- TechnicianLocationUpdated
- ArrivalETAUpdated
- InvoicePaid

Transactional business changes and event publication should use an outbox pattern. Consumers must be idempotent.

## Azure Functions boundary

Functions are reserved for asynchronous and scheduled work:

- Arrival reminders
- Webhook processing
- PDF and proposal rendering
- Image processing
- Nightly analytics
- Scheduled maintenance
- AI summarization
- Integration synchronization

Synchronous business workflows remain in the API application.

## Implementation phases

### Phase 1: Infrastructure foundation

Provision and validate:

- Resource groups
- VNet and private networking
- Key Vault
- Container Apps environment
- PostgreSQL Flexible Server
- Azure Cache for Redis
- Service Bus
- Blob Storage
- Application Insights and Log Analytics

No product feature should depend on manually created cloud resources.

### Phase 2: Core platform CRUD

Create the NestJS API with modules for:

- Organizations
- Locations
- Users
- Industries
- Customers
- Properties
- Assets

Use application handlers, domain models, repository interfaces, PostgreSQL adapters, and events.

### Phase 3: Identity and authorization

Implement:

- Microsoft Entra External ID
- JWT verification
- Organization middleware
- RBAC and location-scoped access
- Tenant-isolation tests
- Audit logging

Scheduling does not begin until this phase passes security tests.

### Phase 4: Work management

Implement:

- Technicians
- Work orders
- Visits
- Assignments
- Scheduling calendar
- Dispatch board

### Phase 5: Communications

Implement Azure Communication Services adapters for email, SMS, arrival alerts, and message history.

### Phase 6: Maps and live operations

Implement Azure Maps geocoding, routing, ETA calculation, technician position ingestion, and dispatch visualization.

### Phase 7: Customer portal

Implement secure tracking links, real-time arrival status, chat, quote approval, invoices, and payments.

## First end-to-end milestone

The milestone is complete when:

1. An owner creates an account and organization.
2. The owner enables one or more industries.
3. The owner creates a customer, property, and asset.
4. The office creates a work order and assigns a technician.
5. Technician status and location update in real time.
6. The dashboard updates without a page refresh.
7. The customer receives a secure tracking link.
8. The customer tracking page updates without a page refresh.
9. All operations are tenant isolated and auditable.
