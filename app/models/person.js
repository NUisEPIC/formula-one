var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../plugins/schema-tools.js').requireAll
  , Entity   = require('./entity.js').Entity
  , program  = require('./program.js').program;

var person = Schema({
  name: { first: String, last: String },
  gender: String
});

requireAll(person);

var Person = Entity.discriminator('Person', person);

module.exports.person = person;
module.exports.Person = Person;
