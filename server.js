// Modules
require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

// Properties
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// Static path for resources
app.use('/public', express.static(__dirname + '/public'))

// Secure the api using JWT
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register', '/api/tasks'] }));

// Routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/tasks', require('./controllers/api/tasks.controller'));

// Make app default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// Start server
app.listen(config.port, function() {
	console.log('Listening on port '+config.port+'...')
})
