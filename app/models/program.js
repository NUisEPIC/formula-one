var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var program = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  shortname: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  description: String,
  startYear: Date,
});

module.exports.program = program;
module.exports.Program = mongoose.model('Program', program);
