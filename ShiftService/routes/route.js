var express = require('express');
var TempShifts = require('../models/shift');
var router = express.Router();

app.get('/shifts', function (req, res){
    TempShifts.find({}, 'shift', function(err, shifts){
        if(err){
        } else{
            res.render('shift-list', shifts);
        }
    })
});

module.exports = router;