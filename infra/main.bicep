targetScope = 'resourceGroup'

@description('Short environment name such as dev, staging, or prod.')
param environmentName string

@description('Azure region for ServiceOS resources.')
param location string = resourceGroup().location

@description('Globally unique resource-name prefix.')
param namePrefix string

@secure()
@description('PostgreSQL administrator password. Supply through azd or a secure CI secret.')
param postgresqlAdministratorPassword string

var isProd = environmentName == 'prod'
var tags = {
  application: 'ServiceOS'
  environment: environmentName
  managedBy: 'Bicep'
}

module network './modules/network.bicep' = {
  name: 'network-${environmentName}'
  params: {
    environmentName: environmentName
    location: location
    namePrefix: namePrefix
    tags: tags
  }
}

resource workloadIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${namePrefix}-${environmentName}-workload-id'
  location: location
  tags: tags
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${namePrefix}-${environmentName}-logs'
  location: location
  tags: tags
  properties: {
    retentionInDays: isProd ? 90 : 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${namePrefix}-${environmentName}-appinsights'
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: take(toLower(replace('${namePrefix}${environmentName}files', '-', '')), 24)
  location: location
  tags: tags
  sku: {
    name: isProd ? 'Standard_GZRS' : 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    defaultToOAuthAuthentication: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    publicNetworkAccess: isProd ? 'Disabled' : 'Enabled'
  }
}

resource serviceDocuments 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: '${storage.name}/default/service-documents'
  properties: {
    publicAccess: 'None'
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: take('${namePrefix}-${environmentName}-kv', 24)
  location: location
  tags: tags
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enablePurgeProtection: isProd
    enableSoftDelete: true
    softDeleteRetentionInDays: isProd ? 90 : 30
    publicNetworkAccess: isProd ? 'Disabled' : 'Enabled'
  }
}

resource containerEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${namePrefix}-${environmentName}-cae'
  location: location
  tags: tags
  properties: {
    vnetConfiguration: {
      infrastructureSubnetId: network.outputs.containerAppsSubnetId
      internal: isProd
    }
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource serviceBus 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: '${namePrefix}-${environmentName}-bus'
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    disableLocalAuth: true
    minimumTlsVersion: '1.2'
    publicNetworkAccess: isProd ? 'Disabled' : 'Enabled'
    zoneRedundant: isProd
  }
}

resource domainEvents 'Microsoft.ServiceBus/namespaces/topics@2024-01-01' = {
  parent: serviceBus
  name: 'domain-events'
  properties: {
    defaultMessageTimeToLive: 'P14D'
    duplicateDetectionHistoryTimeWindow: 'PT10M'
    enableBatchedOperations: true
    enablePartitioning: true
    maxSizeInMegabytes: 5120
    requiresDuplicateDetection: true
    supportOrdering: true
  }
}

resource asyncWork 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' = {
  parent: serviceBus
  name: 'async-work'
  properties: {
    deadLetteringOnMessageExpiration: true
    defaultMessageTimeToLive: 'P7D'
    duplicateDetectionHistoryTimeWindow: 'PT10M'
    enableBatchedOperations: true
    enablePartitioning: true
    lockDuration: 'PT2M'
    maxDeliveryCount: 10
    maxSizeInMegabytes: 5120
    requiresDuplicateDetection: true
  }
}

module data './modules/data.bicep' = {
  name: 'data-${environmentName}'
  params: {
    environmentName: environmentName
    location: location
    namePrefix: namePrefix
    postgresqlAdministratorPassword: postgresqlAdministratorPassword
    postgresqlSubnetId: network.outputs.postgresqlSubnetId
    postgresqlPrivateDnsZoneId: network.outputs.postgresqlPrivateDnsZoneId
    tags: tags
  }
}

resource storageBlobContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, workloadIdentity.id, 'blob-contributor')
  scope: storage
  properties: {
    principalId: workloadIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
  }
}

resource keyVaultSecretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, workloadIdentity.id, 'secrets-user')
  scope: keyVault
  properties: {
    principalId: workloadIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
  }
}

resource serviceBusDataOwner 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(serviceBus.id, workloadIdentity.id, 'service-bus-owner')
  scope: serviceBus
  properties: {
    principalId: workloadIdentity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '090c5cfd-751d-490a-894a-3ce6f1109419')
  }
}

output workloadIdentityClientId string = workloadIdentity.properties.clientId
output workloadIdentityResourceId string = workloadIdentity.id
output vnetId string = network.outputs.vnetId
output storageAccountName string = storage.name
output keyVaultName string = keyVault.name
output containerAppsEnvironmentId string = containerEnvironment.id
output applicationInsightsConnectionString string = appInsights.properties.ConnectionString
output serviceBusNamespace string = serviceBus.name
output domainEventsTopic string = domainEvents.name
output asyncWorkQueue string = asyncWork.name
output postgresqlHost string = data.outputs.postgresqlHost
output postgresqlDatabaseName string = data.outputs.postgresqlDatabaseName
output redisHost string = data.outputs.redisHost
output redisPort int = data.outputs.redisPort
