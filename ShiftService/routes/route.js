var express = require('express');
var TempShifts = require('../models/shift');
var router = express.Router();

router.route('/shift/:date')
.get(function(req,res){
var shifts = [];
for(var shiftList = 0; shiftList < TempShifts.length; shiftList++) {
    var shift= TempShifts[shiftList];
    if (shift.ShiftDate==req.params.date && shift.Assigned=="false")
    {
      shifts.push(shift);
    }
}
  res.json(shifts);
})

module.exports = router;
