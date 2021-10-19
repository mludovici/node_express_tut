"use strict";
exports.__esModule = true;
var express = require("express");
var redis = require('redis');
var app = express();
var http = require('http');
var server = http.createServer(app);
var Server = require('socket.io').Server;
var io = new Server(server);
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
var expressSession = require("express-session");
// let redisStore = require('connect-redis')(expressSession)
// let redisClient = redis.createClient()
io.on('connection', function (socket) {
    console.log('a user connected', socket);
    socket.on('myMessage', 'hi from socket.io server');
});
app.use(expressSession({
    // resave: true,
    // saveUninitialized: true,
    secret: 'woho'
}));
//SET VARIABLES with .set
app.set('PORT', process.env.PORT || 3333);
//COOKIE HANDLING
app.use(cookieParser());
//SERVE STATIC DIRECTORY
app.use('/', express.static('public'));
//PARSE BODIES FROM URL with extended true for any type, e.g multipart form data
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.get('/', (request, response) => {
// 	response.send('Hello from express.js')
// })
app.get('/api/sayHello/:name', function (req, res, next) {
    var name = req.params.name;
    if (!isNaN(name)) {
        res.status(400).send('No string as name');
    }
    else {
        res.json({
            message: "Hallo " + name
        });
    }
});
app.get('/session', function (req, res) {
    //req.session.name = req.session.name || new Date().toUTCString()
    console.log(req.sessionID);
    res.json(req.session);
});
app.post('/api/sayHello/', upload.array(), function (req, res, next) {
    var name = req.body.name;
    if (!isNaN(name)) {
        res.status(400).send('No string as name');
    }
    else {
        res.json({
            message: "Hallo " + name
        });
    }
});
app.get('/cookie', function (req, res) {
    if (req.cookies.visited) {
        res.send('Du hast die Cookies schon genutzt.');
    }
    else {
        res.cookie('visited', true);
        res.send('DU besuchst die cookies zum ersten mal.');
    }
});
app.listen(3333, function () { return console.log("app listen on port " + process.env.PORT); });
