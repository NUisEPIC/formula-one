var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , Person   = require('./person.js').Person;

var student = Schema({
  schoolEmail: String,
  univerity: String,
  school: String,
  major: String,
  class: String
});
