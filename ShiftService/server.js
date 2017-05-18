// Set up our packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var apiRoute = require('./routes/route');

// Connect to our database
//mongoose.connect('mongodb://admin:Tesco123@ds143181.mlab.com:43181/colleague');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// Set our port
var port = 8080;

// Prefix our routes with with /simple-api
app.use('/shiftapi', apiRoute)
// START THE SERVER
app.listen(port, function () {
})
