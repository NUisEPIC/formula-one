var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , DateRange = require('./date-range.js')
    , FormulaIngredient = require('./formula-ingredient.js');

var program = new Schema({
  name: String,
  description: String,
  dates: [DateRange],
  ingredients: [FormulaIngredient]
});

program.virtual('year')
       .get(function () {
         return new Date(this.dates.map(function(date) { return date.start })
                          .sort()
                          .reverse()[0]).getFullYear();
       });

module.exports = mongoose.model('Program', program);
