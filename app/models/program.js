var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , DateRange = require('./date-range.js')
    , ingredient = require('./formula-ingredient.js').ingredient;

var program = new Schema({
  name: {type: String, index: {unique: true, dropDups: true}},
  shortname: {type: String, index: {unique: true, dropDups: true}},
  description: String,
  dates: [{start: { type: Date, default: Date.now },
           end: Date}],
  ingredients: [ingredient]
});

program.virtual('year')
       .get(function () {
         return new Date(this.dates.map(function(date) { return date.start })
                          .sort()
                          .reverse()[0]).getFullYear();
       });

module.exports = mongoose.model('Program', program);
