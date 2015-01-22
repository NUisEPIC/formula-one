var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , FormulaIngredient = require('./formula-ingredient.js').FormulaIngredient
    , question = require('./question.js').question
    , response = require('./response.js').response;

var application = Schema({
  questions: [question],
  responses: [response]
});

var Application = FormulaIngredient.discriminator('Application', application);

module.exports = Application;
