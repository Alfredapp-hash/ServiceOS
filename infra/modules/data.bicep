@description('Deployment environment name.')
param environmentName string

@description('Azure region.')
param location string

@description('Resource naming prefix.')
param namePrefix string

@secure()
@description('PostgreSQL administrator password. Supply through azd or a secure pipeline secret.')
param postgresqlAdministratorPassword string

@description('Delegated subnet for PostgreSQL Flexible Server.')
param postgresqlSubnetId string

@description('Private DNS zone for PostgreSQL Flexible Server.')
param postgresqlPrivateDnsZoneId string

param tags object

var isProd = environmentName == 'prod'

resource postgresql 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: '${namePrefix}-${environmentName}-postgres'
  location: location
  tags: tags
  sku: {
    name: isProd ? 'Standard_D4ds_v5' : 'Standard_B2ms'
    tier: isProd ? 'GeneralPurpose' : 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: 'serviceosadmin'
    administratorLoginPassword: postgresqlAdministratorPassword
    network: {
      delegatedSubnetResourceId: postgresqlSubnetId
      privateDnsZoneArmResourceId: postgresqlPrivateDnsZoneId
      publicNetworkAccess: 'Disabled'
    }
    highAvailability: {
      mode: isProd ? 'ZoneRedundant' : 'Disabled'
    }
    storage: {
      storageSizeGB: isProd ? 256 : 64
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: isProd ? 35 : 7
      geoRedundantBackup: isProd ? 'Enabled' : 'Disabled'
    }
  }
}

resource serviceOsDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
  parent: postgresql
  name: 'serviceos'
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

resource managedRedis 'Microsoft.Cache/redisEnterprise@2024-10-01' = {
  name: '${namePrefix}-${environmentName}-redis'
  location: location
  tags: tags
  sku: {
    name: isProd ? 'Balanced_B3' : 'Balanced_B0'
  }
  properties: {
    minimumTlsVersion: '1.2'
  }
}

resource managedRedisDatabase 'Microsoft.Cache/redisEnterprise/databases@2024-10-01' = {
  parent: managedRedis
  name: 'default'
  properties: {
    clientProtocol: 'Encrypted'
    clusteringPolicy: 'EnterpriseCluster'
    evictionPolicy: 'VolatileLRU'
    port: 10000
  }
}

output postgresqlServerName string = postgresql.name
output postgresqlHost string = postgresql.properties.fullyQualifiedDomainName
output postgresqlDatabaseName string = serviceOsDatabase.name
output redisName string = managedRedis.name
output redisHost string = managedRedis.properties.hostName
output redisPort int = managedRedisDatabase.properties.port
