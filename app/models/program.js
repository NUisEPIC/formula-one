var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../plugins/schema-tools.js').requireAll
  , ingredient = require('./formula-ingredient.js').ingredient;

var program = new Schema({
  name:        { type:    String,
                 index:   { unique:   true,
                            dropDups: true } },
  shortname:   { type:    String,
                 index:   { unique:   true,
                            dropDups: true } },
  description: String,
  dates:       [ { start: Date,
                   end:   Date } ],
  ingredients: [ ingredient ]
});

program.virtual('mostRecentYear')
       .get(function () {
         return new Date(this.dates.map(function(date) { return date.start })
                             .sort()
                             .reverse()[0]).getFullYear();
       });

requireAll(program);

module.exports.program = program;
module.exports.Program = mongoose.model('Program', program);
