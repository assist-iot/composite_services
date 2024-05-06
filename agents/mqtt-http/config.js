module.exports = {
  mqtt: {
    serverUrl: process.env.MQTT_URL || 'edbe:1883',
    username: process.env.MQTT_USER || 'assist',
    password: process.env.MQTT_PASSWORD || '4ss1st10t',
    topic: process.env.MQTT_TOPIC || 'test-mqtt-http'
  },
  http: {
    serverUrl: process.env.HTTP_URL || 'http://localhost:8080',
    method: process.env.HTTP_METHOD || 'post'
  }
}