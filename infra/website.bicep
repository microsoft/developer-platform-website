param location string = resourceGroup().location

param name string = resourceGroup().name

var name_clean = replace(replace(replace(toLower(trim(name)), ' ', '-'), '_', '-'), '.', '-')

var name_server = name_clean
var name_site = name_clean
var name_workspace = name_clean
var name_insights = name_clean

var image = 'DOCKER|ghcr.io/microsoft/developer-platform-website/website'

resource workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: name_workspace
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    workspaceCapping: {
      dailyQuotaGb: -1
    }
    publicNetworkAccessForQuery: 'Enabled'
    publicNetworkAccessForIngestion: 'Enabled'
  }
}

resource insights 'Microsoft.Insights/components@2020-02-02' = {
  name: name_insights
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
    RetentionInDays: 90
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource server 'Microsoft.Web/serverfarms@2022-03-01' = {
  kind: 'linux'
  name: name_server
  location: location
  properties: {
    reserved: true
  }
  sku: {
    name: 'P1v3'
    tier: 'PremiumV3'
  }
}

resource site 'Microsoft.Web/sites@2022-03-01' = {
  kind: 'api,linux,container'
  name: name_site
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    reserved: true
    serverFarmId: server.id
    clientAffinityEnabled: false
    siteConfig: {
      alwaysOn: true
      phpVersion: 'off'
      linuxFxVersion: image
      acrUseManagedIdentityCreds: true
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: insights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: insights.properties.ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'DOCKER_ENABLE_CI'
          value: 'true'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://ghcr.io'
        }
        {
          name: 'VITE_API_URL'
          value: 'http://localhost:7088'
        }
        {
          name: 'VITE_MSAL_CLIENT_ID'
          value: '121b9755-f739-44ec-bd62-115e17eb367e'
        }
        {
          name: 'VITE_MSAL_TENANT_ID'
          value: '834ffa2f-8407-4308-a72c-8536843b8488'
        }
        {
          name: 'VITE_MSAL_SCOPE'
          value: 'api://41b7f870-f4ad-4814-8b11-1d90341ce94f/.default'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'XDT_MicrosoftApplicationInsights_Mode'
          value: 'Recommended'
        }
      ]
    }
  }
}
