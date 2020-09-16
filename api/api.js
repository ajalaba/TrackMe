const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ajalaba:aaron123@cluster0.dzxsx.mongodb.net', { useNewUrlParser: true,
useUnifiedTopology: true });


const port = process.env.PORT || 5000;
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const Device = require('./models/device');
const User = require('./models/user');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/test', (req, res) => {
res.send('The API is working!');
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

app.get('/api/devices', (req, res) => {
Device.find({}, (err, devices) => {
return err
? res.send(err)
: res.send(devices);
});
});

/**
* @api {post} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*   { successfully added device and data }
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/  
app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
    name,
    user,
    sensorData
    });
    newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
    });
    });

    /**
* @api {post} /api/authenticate Authentication of data
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*   { Authenticated successfully }
* @apiErrorExample {json} Error-Response:
* {
* "No user found"
* "Incorrect password"
* }
*/  

app.post('/api/authenticate', (req, res) => {
    const { user, password } = req.body;
    User.findOne({
        name: user
        }, (err, found) => {
            if (err) {
                return res.send(err);
            } else if (!found) {
                return res.send('No user found');
            } else if (found.password !== password) {
                return res.send('Incorrect password');
            } else {
                return res.json({
                    success: true,
                    message: 'Authenticated successfully',
                    isAdmin: found.isAdmin
                });
            }
        });
});

    /**
* @api {post} /api/registration Registration of data
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*   { Created new user }
* @apiErrorExample {json} Error-Response:
* {
* "User already exists"
* }
*/ 
app.post('/api/registration', (req, res) => {
	const { user, password, isAdmin } = req.body;
	console.log(req.body);
	User.findOne({
		name: user
		    }, (err, found) => {
		if (err) {
		    return res.send(err);
		} else if (found) {
		    return res.send('User already exists');
		} else {
		    const newUser = new User({
			    name: user,
			    password,
			    isAdmin
			});
		    newUser.save(err => {
        return err
	? res.send(err)
	: res.json({
		success: true,
		message: 'Created new user'
	    });
			});
		}
        });
    });


app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) => {
    const { sensorData } = devices;
    return err
    ? res.send(err)
    : res.send(sensorData);
    });
});

app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices);
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});
