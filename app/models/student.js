var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var student = Schema({
  schoolEmail: String,
  univerity:   String,
  school:      String,
  major:       String,
  class:       String
});
