var express = require('express');
var TempShifts = require('../models/shift');
var router = express.Router();

router.route('/shifts')
.get(function (req, res){
<<<<<<< HEAD
    TempShifts.find({}, 'shifts', function(err, shifts){
=======
    TempShifts.find({}, 'shift', function(err, shifts){
>>>>>>> origin/master
        if(err){
        } else{
            res.render('shift-list', shifts);
        }
    })
});

router.route('/shift/:date')

.get(function(req,res){
var shifts = [];

TempShifts.find({}, 'shift', function(err, shifts){
    if(err){
    } else{
    	 for(var shiftList = 0; shiftList < TempShifts.length; shiftList++) {
    	    var shift= TempShifts[shiftList];
    	    if (shift.ShiftDate==req.params.date && shift.Assigned=="false")
    	    {
    	      shifts.push(shift);
    	    }
    	}
<<<<<<< HEAD

=======
        
>>>>>>> origin/master
    }
})


  res.json(shifts);
})

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> origin/master
