var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var program = new Schema({
  name: {
    type: String,
    index:   {
      unique:   true,
      dropDups: true
    },
    required: true
  },
  shortname: {
    type: String,
    index: {
      unique:   true,
      dropDups: true
    },
    required: true
  },
  description: String,
  year: Number
});

module.exports.program = program;
module.exports.Program = mongoose.model('Program', program);
