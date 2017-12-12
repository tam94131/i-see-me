// require express and other modules
var express = require('express');
var app = express();

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/************
 * DATABASE *
 ************/

var db = require('./models');
var controller = require('./controller');


/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
	console.log("got homepage request (server.js)");
    res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */

//POST request for creating a new account.
app.post('/profile', controller.profile.create);

//GET request for logging in.
app.get('/profile', controller.profile.logIn);

//GET request for logging in using cookie.
app.get('/profile/cookie', controller.profile.cookieLogIn);

//GET request for all pic history of current user.
///pic/:userId
app.get('/pic', controller.pic.getPicHistory);

//POST request for file upload
app.post('/pic/fileupload', controller.pic.fileUpload);

//--------------------

//PUT request for updating user profile.
//app.put('/profile/update', controller.profile.update);

//GET request for all profiles.
app.get('/profile/all', controller.profile.getAll);

//GET request for all profile(for the admin dashboard).
app.get('/profile/all/dashboard', controller.profile.getDashboard);

//PUT request for adding user pic in his Profile data and add a pic data history.
//app.put('/profile/pic', controller.profile.addPic);


/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log('Express server is up and running on http://localhost:3000/');
});
