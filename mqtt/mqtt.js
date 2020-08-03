const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
console.log('connected');
});