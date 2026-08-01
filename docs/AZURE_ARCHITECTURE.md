# ServiceOS Azure-First Architecture

## Decision

ServiceOS will use Azure as the primary cloud platform while keeping external-service dependencies behind provider interfaces. Azure is the default implementation, not a hard application-layer dependency.

## Primary Azure services

- Azure Container Apps: NestJS API, workers, scheduled processors, and webhook consumers.
- Azure Static Web Apps or Azure Front Door + App Service: Next.js dashboard and customer portal.
- Azure Database for PostgreSQL Flexible Server: primary relational database.
- Azure Cache for Redis: caching, locks, sessions, queues, and rate limiting.
- Azure Blob Storage: photos, videos, roof inspections, manuals, contracts, permits, and exports.
- Azure Service Bus: durable domain-event delivery and background job coordination.
- Azure Functions: isolated event handlers, scheduled tasks, media processing, and integration jobs.
- Azure Maps: dispatch maps, geocoding, routing, traffic-aware ETA, geofencing, and customer tracking.
- Azure Communication Services: SMS, voice, chat, and customer appointment notifications.
- Microsoft Entra External ID: customer and workforce identity, SSO, MFA, and enterprise federation.
- Azure OpenAI: call summaries, estimate assistance, document extraction, operational insights, and retrieval workflows.
- Azure Key Vault: application secrets, provider credentials, encryption keys, and certificate material.
- Azure Monitor + Application Insights: logs, metrics, traces, alerts, and performance monitoring.
- Azure Front Door + Web Application Firewall: global routing, TLS, caching, and edge protection.

## Runtime topology

```text
Customer / Office / Technician
          |
Azure Front Door + WAF
          |
  Next.js applications
          |
 Azure Container Apps API
          |
  -----------------------------
  |            |              |
PostgreSQL   Redis        Service Bus
  |            |              |
Blob Storage  Workers      Functions
          |
Azure Maps / Communication Services / Azure OpenAI
```

## Data strategy

PostgreSQL remains the source of truth. Every tenant-owned record includes `organization_id`. Authorization is enforced in the API and database policies. GPS events are append-only operational records with configurable retention. Customer tracking links use short-lived signed tokens and expose only the assigned technician's current journey.

## Provider boundaries

Application code must depend on interfaces rather than Azure SDK calls directly:

- `MapsProvider`
- `MessagingProvider`
- `StorageProvider`
- `IdentityProvider`
- `AIProvider`
- `EventBusProvider`
- `SecretsProvider`
- `ObservabilityProvider`

The first implementations will use Azure Maps, Azure Communication Services, Blob Storage, Entra External ID, Azure OpenAI, Service Bus, Key Vault, and Application Insights.

## Environment progression

- Local: Docker PostgreSQL and Redis, Azurite, provider mocks.
- Development: shared Azure development subscription with isolated resource group.
- Staging: production-like topology and synthetic data.
- Production: separate subscription or strict resource-group and policy isolation, private networking for data services, managed identities, backup policies, and WAF.

## Security requirements

- Managed identity wherever supported.
- No production secrets stored in repository or ordinary application settings.
- Private endpoints for PostgreSQL, Redis, Storage, and Key Vault when economically practical.
- Least-privilege RBAC.
- MFA for privileged users.
- Immutable audit events for administrative and financial actions.
- Location tracking only during authorized workforce states.
- Short GPS retention by default, configurable for lawful business needs.

## Initial deployment sequence

1. Provision resource group, Container Apps environment, PostgreSQL, Redis, Storage, Key Vault, and Application Insights.
2. Deploy dashboard and API health endpoints.
3. Add Entra identity and organization onboarding.
4. Add Service Bus and background worker.
5. Add Azure Maps dispatch and tracking proof of concept.
6. Add Communication Services SMS notifications.
7. Add Azure OpenAI only after core workflows produce reliable structured data.
