module.exports = {
  http: {
    serverUrl: process.env.HTTP_URL || 'http://ltse-api:8080/api/nosql/index/_search',
    method: process.env.HTTP_METHOD || 'post',
    requestInterval: process.env.HTTP_REQUESTINTERVAL || 5,
    requestBody: process.env.HTTP_REQUESTBODY || '{"size": 1}'
  },
  mqtt: {
    serverUrl: process.env.MQTT_URL || 'edbe:1883',
    username: process.env.MQTT_USER || 'assist',
    password: process.env.MQTT_PASSWORD || '4ss1st10t',
    topic: process.env.MQTT_TOPIC || 'test-mqtt-http'
  }
}