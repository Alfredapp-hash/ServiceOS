# ServiceOS Azure Infrastructure

This directory contains the Azure-first infrastructure foundation for ServiceOS.

## Current resources

- Virtual network with dedicated subnets for Container Apps, PostgreSQL, and private endpoints
- PostgreSQL Flexible Server with a private delegated subnet and private DNS
- Azure Managed Redis
- Container Apps managed environment with VNet integration
- User-assigned managed identity for ServiceOS workloads
- Key Vault with RBAC authorization
- Blob Storage with public access disabled
- Service Bus Standard namespace
- `domain-events` topic
- `async-work` queue
- Log Analytics and Application Insights

## Deployment

Set a secure PostgreSQL administrator password in the active Azure Developer CLI environment:

```bash
azd env set POSTGRESQL_ADMINISTRATOR_PASSWORD "<secure-password>"
```

Validate the Bicep template:

```bash
az bicep build --file infra/main.bicep
```

Run a deployment validation before creating resources:

```bash
az deployment group validate \
  --resource-group <resource-group> \
  --template-file infra/main.bicep \
  --parameters \
    environmentName=dev \
    namePrefix=serviceos \
    postgresqlAdministratorPassword="$POSTGRESQL_ADMINISTRATOR_PASSWORD"
```

Deploy through Azure Developer CLI after the environment is configured:

```bash
azd provision
```

## Security boundaries

- Production PostgreSQL has no public network access.
- Production Container Apps use an internal managed environment.
- Production Storage, Key Vault, and Service Bus disable public network access.
- Application workloads authenticate with a user-assigned managed identity.
- Local authentication is disabled for Service Bus.
- Storage shared-key authentication is disabled.
- Redis and PostgreSQL are for transient platform state and durable business data respectively; Redis must never become the system of record.

## Required follow-up

The next infrastructure change should add private endpoints and private DNS zones for Storage, Key Vault, Service Bus, and Azure Managed Redis. Container Apps for the API and dashboard should be added only after their images and health endpoints exist.
