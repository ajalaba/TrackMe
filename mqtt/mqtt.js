const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const randomCoordinates = require('random-coordinates')
const rand = require('random-int')

const app = express();
const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

mongoose.connect('mongodb+srv://ajalaba:aaron123@cluster0.dzxsx.mongodb.net', { useNewUrlParser: true,
useUnifiedTopology: true });

const Device = require('./models/device');

// client.on('connect', () => {
// console.log('connected');
// });

// const topic = '/myid/test/hello/';
// const msg = 'Hello MQTT world!';

// client.publish(topic, msg, () => {
// console.log('message sent...');
// });

client.on('connect', () => {
client.subscribe('/sensorData');
console.log('mqtt connected');
});

const port = process.env.PORT || 5001;

app.use(express.static('public'));
app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/myid/command/${deviceId}`;
    client.publish(topic, command, () => {
    res.send('published new message');
    });
    });


/**
* @mqtt {put} /sensor-data Sensor-data of device
* @mqttGroup Device
* @mqttSuccessExample {json} Success-Response:
*   { published new message }
* @mqttErrorExample {json} Error-Response:
* { "deviceID does not exist" }
*/ 
app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
    res.send('published new message');
    });
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
    console.log(`Received message on ${topic}: ${message}`);
    const data = JSON.parse(message);
    Device.findOne({"name": data.deviceId }, (err, device) => {
    if (err) {
    console.log(err)
    }
    const { sensorData } = device;
    const { ts, loc, temp } = data;
    sensorData.push({ ts, loc, temp });
    device.sensorData = sensorData;
    device.save(err => {
    if (err) {
    console.log(err)
    }
    });
    });
}
});

app.listen(port, () => {
console.log(`listening on port ${port}`);
});



