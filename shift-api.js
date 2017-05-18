var mongo = require('mongoskin');

//name of database
var db = mongo.db('mongodb://Admin:Tesco123@ds143181.mlab.com:43181/colleague', {native_parser:true});

db.bind('shifts');

//this is the code to create a 'get' call to find all the list of users in the Mongo db
exports.getShifts = function(req, res) {
    db.shifts.find().toArray(function(err, shifts) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(shifts);
        }
    });
};

/*
//this is the code to create a 'post' call to update the mongodb with a new user
exports.postUser = function(req, res) {

    var requestType = req.get('Content-Type');

    if (requestType == "application/json") {
        db.users.insert(req.body, function(err, response){
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(201).send(response.ops[0]);
            }
        });
    }
    else {
        res.status(400).send("This post call expects a content-type of application/json");
    }
};

*/
exports.ping = function(req,res){
    res.status(200).send("Server is up and running!");
};
