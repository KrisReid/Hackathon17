// Set up mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Shift', new Schema([{
    StoreNumber: String,
    StoreName: String,
    Shift: String,
    Department: String,
    ShiftType: String,
    Duration: String,
    ShiftDate: String
    }]
  ));
