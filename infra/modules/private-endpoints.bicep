targetScope = 'resourceGroup'

param location string
param namePrefix string
param environmentName string
param privateEndpointSubnetId string
param virtualNetworkId string
param storageAccountId string
param keyVaultId string
param serviceBusNamespaceId string
param redisId string

var tags = {
  application: 'ServiceOS'
  environment: environmentName
  managedBy: 'Bicep'
}

resource blobDns 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.blob.core.windows.net'
  location: 'global'
  tags: tags
}

resource vaultDns 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.vaultcore.azure.net'
  location: 'global'
  tags: tags
}

resource serviceBusDns 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.servicebus.windows.net'
  location: 'global'
  tags: tags
}

resource redisDns 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.redis.azure.net'
  location: 'global'
  tags: tags
}

resource blobDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: blobDns
  name: '${namePrefix}-${environmentName}-blob-link'
  location: 'global'
  properties: {
    virtualNetwork: { id: virtualNetworkId }
    registrationEnabled: false
  }
}

resource vaultDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: vaultDns
  name: '${namePrefix}-${environmentName}-vault-link'
  location: 'global'
  properties: {
    virtualNetwork: { id: virtualNetworkId }
    registrationEnabled: false
  }
}

resource serviceBusDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: serviceBusDns
  name: '${namePrefix}-${environmentName}-bus-link'
  location: 'global'
  properties: {
    virtualNetwork: { id: virtualNetworkId }
    registrationEnabled: false
  }
}

resource redisDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: redisDns
  name: '${namePrefix}-${environmentName}-redis-link'
  location: 'global'
  properties: {
    virtualNetwork: { id: virtualNetworkId }
    registrationEnabled: false
  }
}

resource storageEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-${environmentName}-blob-pe'
  location: location
  tags: tags
  properties: {
    subnet: { id: privateEndpointSubnetId }
    privateLinkServiceConnections: [{
      name: 'blob'
      properties: {
        privateLinkServiceId: storageAccountId
        groupIds: ['blob']
      }
    }]
  }
}

resource storageDnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  parent: storageEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [{ name: 'blob'; properties: { privateDnsZoneId: blobDns.id } }]
  }
}

resource vaultEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-${environmentName}-vault-pe'
  location: location
  tags: tags
  properties: {
    subnet: { id: privateEndpointSubnetId }
    privateLinkServiceConnections: [{
      name: 'vault'
      properties: {
        privateLinkServiceId: keyVaultId
        groupIds: ['vault']
      }
    }]
  }
}

resource vaultDnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  parent: vaultEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [{ name: 'vault'; properties: { privateDnsZoneId: vaultDns.id } }]
  }
}

resource busEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-${environmentName}-bus-pe'
  location: location
  tags: tags
  properties: {
    subnet: { id: privateEndpointSubnetId }
    privateLinkServiceConnections: [{
      name: 'namespace'
      properties: {
        privateLinkServiceId: serviceBusNamespaceId
        groupIds: ['namespace']
      }
    }]
  }
}

resource busDnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  parent: busEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [{ name: 'servicebus'; properties: { privateDnsZoneId: serviceBusDns.id } }]
  }
}

resource redisEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${namePrefix}-${environmentName}-redis-pe'
  location: location
  tags: tags
  properties: {
    subnet: { id: privateEndpointSubnetId }
    privateLinkServiceConnections: [{
      name: 'redis'
      properties: {
        privateLinkServiceId: redisId
        groupIds: ['redisEnterprise']
      }
    }]
  }
}

resource redisDnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  parent: redisEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [{ name: 'redis'; properties: { privateDnsZoneId: redisDns.id } }]
  }
}
