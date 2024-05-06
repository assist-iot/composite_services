const mqtt = require('mqtt');
const axios = require('axios');
const config = require('./config.js')

const options = {
  clientId: "mqttjs01",
  username: config.mqtt.username,
  password: config.mqtt.password,
  clean:true
}

console.log("HTTP endpoint request method and URL: ".concat(config.http.method.toUpperCase()).concat(" ").concat(config.http.serverUrl))
console.log("MQTT topic and broker url: ".concat(config.mqtt.topic).concat(" ").concat(config.mqtt.serverUrl))

const client = mqtt.connect('mqtt://'.concat(config.mqtt.serverUrl))

client.on("connect", function () {
  console.log("connected to the MQTT broker");
  client.subscribe(config.mqtt.topic)
})

client.on("error", error => { 
  console.log("Can't connect to the MQTT broker" + error)
  // process.exit(1)
})

client.on('message',function(topic, message, packet){
	console.log("message is " + message);
  console.log(typeof message)
	console.log("topic is " + topic);
  console.log(packet)

  let data
  try {
    data = JSON.parse(message)
    console.log("data json parsed:" + typeof data)
    if(typeof data !== 'object') throw new SyntaxError
  } catch (error) {
    console.log(error)
    if (error instanceof SyntaxError) {
      console.log('The message is not in JSON format, storing the message under a "message" JSON key...')
      if (data) data = (typeof data === 'object') ? data : { message: data.toString() }
      else data = { message: message.toString() }
    }
  }
  console.log(data)
  
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    console.log('Message is an object')
    axios({
      method: config.http.method,
      url: config.http.serverUrl,
      data: data
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      if (error.message) console.error(error.message)
      if (error.response) console.error(error.response?.data)
    })
  } else if (Array.isArray(data) && data !== null) {
    console.log('Message is an array')
    console.log(data)
    data.forEach(i=>{
      i = (typeof i === 'object') ? i : { message: i.toString() }
      axios({
        method: config.http.method,
        url: config.http.serverUrl,
        data: i
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        if (error.message) console.error(error.message)
        if (error.response) console.error(error.response?.data)
      })
    })
  }
  
})