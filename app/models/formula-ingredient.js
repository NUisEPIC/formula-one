var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Program = require('./program.js')
    , Integration = require('./integration.js');

var ingredient = Schema({
  timestamp: { type: Date, default: Date.now },
  creator: String, // FUTURE: Account
  name: {type: String, index: {unique: true, dropDups: true}},
  purpose: String,
  integrations: [Integration]
});

module.exports.ingredient = ingredient;
module.exports.FormulaIngredient = mongoose.model('FormulaIngredient', ingredient);
