var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Program = require('./program.js')
    , Integration = require('./integration.js');

var ingredient = Schema({
  timestamp: { type: Date, default: Date.now },
  creator: String, // FUTURE: Account
  name: String,
  purpose: String,
  integrations: [Integration]
});

module.exports = mongoose.model('FormulaIngredient', ingredient);
