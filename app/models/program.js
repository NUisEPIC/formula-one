var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../lib/schema-tools.js').requireAll

var program = new Schema({
  name: {
    type: String,
    index:   {
      unique:   true,
      dropDups: true
    }
  },
  shortname: {
    type: String,
    index: {
      unique:   true,
      dropDups: true
    }
  },
  description: String
});

requireAll(program);

module.exports.program = program;
module.exports.Program = mongoose.model('Program', program);
