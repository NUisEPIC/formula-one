var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../plugins/schema-tools.js').requireAll;

var person = Schema({
  account: { type: Schema.types.ObjectId, ref: 'Account' },
  name: { first: { type: String,
                   required: true },
          last:  { type: String,
                   required: true } },
  gender: { type: String,
            required: true }
});

module.exports.person = person;
module.exports.Person = Person;
