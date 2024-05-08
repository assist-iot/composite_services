module.exports = {
  port: process.env.API_PORT || 3000,
  smartOrchestratorUrl: process.env.SMART_ORCHESTRATOR_URL || 'http://smart-api:8080',
  noderedUrl: process.env.NODERED_URL || 'http://127.0.0.1:1880',
  validNodes: process.env.VALID_NODES || 'edbe,ltse,http-endpoint,mqtt-http,http-http,http-mqtt',
  helmChartRepository: process.env.HELM_CHART_REPOSITORY || 'composite-services-agents',
  ltseUrl: process.env.LTSE_URL || 'http://ltse-api:8080',
  ltseIndex: process.env.LTSE_INDEX || 'manageability-flow'
}
