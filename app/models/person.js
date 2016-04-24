var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , program  = require('./program.js').program;

var person = Schema({
  name: { first: { type: String,
                   required: true },
          last:  { type: String,
                   required: true } },
  email:   { type: String, required: true },
  gender:  { type: String },
  hearsay: { type: String }
});

var Person = mongoose.model('Person', person);

module.exports.person = person;
module.exports.Person = Person;
