import express = require('express')
const redis = require('redis')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

let bodyParser = require('body-parser')
let multer = require('multer')
let upload = multer()
let cookieParser = require('cookie-parser')
import expressSession = require('express-session')

// let redisStore = require('connect-redis')(expressSession)
// let redisClient = redis.createClient()

io.on('connection', (socket) => {
	console.log('a user connected', socket)
	socket.on('myMessage', 'hi from socket.io server')
})

app.use(
	expressSession({
		// resave: true,
		// saveUninitialized: true,
		secret: 'woho',
		//store: new redisStore({ client: redisClient }),
	})
)

//SET VARIABLES with .set
app.set('PORT', process.env.PORT || 3333)

//COOKIE HANDLING
app.use(cookieParser())

//SERVE STATIC DIRECTORY
app.use('/', express.static('public'))

//PARSE BODIES FROM URL with extended true for any type, e.g multipart form data
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)
// app.get('/', (request, response) => {
// 	response.send('Hello from express.js')
// })

app.get('/api/sayHello/:name', (req, res, next) => {
	let name = req.params.name
	if (!isNaN(name)) {
		res.status(400).send('No string as name')
	} else {
		res.json({
			message: `Hallo ${name}`,
		})
	}
})

app.get('/session', (req, res) => {
	//req.session.name = req.session.name || new Date().toUTCString()
	console.log(req.sessionID)
	res.json(req.session)
})

app.post('/api/sayHello/', upload.array(), (req, res, next) => {
	let name = req.body.name
	if (!isNaN(name)) {
		res.status(400).send('No string as name')
	} else {
		res.json({
			message: `Hallo ${name}`,
		})
	}
})

app.get('/cookie', function (req, res) {
	if (req.cookies.visited) {
		res.send('Du hast die Cookies schon genutzt.')
	} else {
		res.cookie('visited', true)
		res.send('DU besuchst die cookies zum ersten mal.')
	}
})

app.listen(3333, () => console.log(`app listen on port ${process.env.PORT}`))
