const mqtt = require('mqtt');
const axios = require('axios');
const config = require('./config.js')

const options = {
  clientId: "mqttjs01",
  username: config.mqtt.username,
  password: config.mqtt.password,
  clean: true
}

console.log("HTTP endpoint request method and URL: ".concat(config.http.method.toUpperCase()).concat(" ").concat(config.http.serverUrl))
console.log("MQTT topic and broker url: ".concat(config.mqtt.topic).concat(" ").concat(config.mqtt.serverUrl))

const client = mqtt.connect('mqtt://'.concat(config.mqtt.serverUrl))

client.on("connect", function () {
  console.log("Connected to the MQTT broker")
  const timeout = setInterval(moveData, config.http.requestInterval * 1000)
})

// stop running
client.on("error", error => { 
  console.log("Can't connect to the MQTT broker" + error) 
  // process.exit(1)
})

function moveData() {
  axios({
    method: config.http.method,
    url: config.http.serverUrl,
    data: JSON.parse(config.http.requestBody)
  })
  .then(function (response) {
    let data = response.data
    // console.log('Response size: '.concat(data.length));
    console.log(data)
    if (config.http.serverUrl.includes('nosql')){
      data = response.data.hits.hits
      data.forEach(i=>client.publish(config.mqtt.topic, JSON.stringify(i._source)))
    } else {
      if (typeof data === 'object' && !Array.isArray(data) && data !== null)
        client.publish(config.mqtt.topic, JSON.stringify(data))
      else if (Array.isArray(data) && data !== null)
        data.forEach(i=>client.publish(config.mqtt.topic, JSON.stringify(i)))
    }
  })
  .catch(function (error) {
    if (error.message) console.error(error.message)
    if (error.response) console.error(error.response?.data)
  })
}




