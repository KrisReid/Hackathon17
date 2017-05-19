//this is where we set up the express app and enable API routes.

var express         = require('express');
var bodyParser      = require('body-parser');
var shiftApi        = require('./shift-api.js');

var port            = process.env.PORT || 5050;
var app             = express();


// Middleware
app.use(bodyParser.json());

// Routing - Static Pages
app.use(express.static('public'));

// Users API calls
app.put('/api/shift/:_id', shiftApi.putShift);
app.get('/api/shifts', shiftApi.getShifts);

// Server Ping API call
app.get('/ping', shiftApi.ping);


// Routing - Default route for AngularJS client app
app.all('/*', function(req, res) {
    res.sendFile('index.html', {root: './public/'});
});

// Start
app.listen(port);
console.log("shift app is listening on port 5050");

//
// /var express = require('express');
// var path = require('path');
// var bodyParser = require('body-parser');
//
// var app = express();
// app.set('port', (process.env.PORT || 5050));
//
// app.use(express.static(__dirname + '/public'));
//
//
// var mongoose = require('mongoose');
//
// mongoose.connect('mongodb://kris:kris@ds157839.mlab.com:57839/tnf/');
//
// //Model
// var Shift = require('./ShiftService/models/shift.js');
// // var Player = require('./ShiftService/models/player.model.js');
//
// // views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
//
// app.get('/test', function(request, response) {
//   response.send("Tests");
// //  response.render(express.static(path.join(__dirname,'/public/pages/dashboard.html')));
// });
//
// //get shifts
// app.get('/shifts', function(request, response) {
//
//   Shift.find({}, function(err, docs) {
//     if(err) return console.error(err);
//     res.json(docs);
//   });
// });
//
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
