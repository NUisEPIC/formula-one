var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , FormulaIngredient = require('./formula-ingredient.js')
    , Question = require('./question.js')
    , Response = require('./response.js');

var application = Schema({
  questions: [Question],
  responses: [Response]
});

var Application = FormulaIngredient.disciminator('Application', application);
