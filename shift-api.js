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

exports.putShift = function(req, res) {

  db.shifts.findById(req.params._id, function(error, shift){

    shift._id = req.body._id;
    shift.StoreNumber = req.body.StoreNumber;
    shift.StoreName = req.body.StoreName;
    shift.Shift = req.body.Shift;
    shift.Department = req.body.Department;
    shift.ShiftType = req.body.ShiftType;
    shift.ShiftTime = req.body.ShiftTime;
    shift.Duration = req.body.Duration;
    shift.ShiftDate = req.body.ShiftDate;
    shift.ShiftId = req.body.ShiftId;
    shift.Assigned = req.body.Assigned;

    db.shifts.insert({_id: shift._id}, {StoreNumber: shift.StoreNumber, StoreName: shift.StoreName, Shift: shift.Shift, Department: shift.Department, ShiftType: shift.ShiftType, ShiftTime: shift.ShiftTime, Duration: shift.Duration, ShiftDate: shift.ShiftDate, ShiftId: shift.ShiftId, Assigned: shift.Assigned}, function (err) {
      if (err) {
        res.status(500).send(err);
        throw err;
      }
      else {
        res.status(201).send();
      }
    })

  });
};

exports.ping = function(req,res){
    res.status(200).send("Server is up and running!");
};
