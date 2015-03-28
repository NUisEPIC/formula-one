var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , requireAll = require('../plugins/schema-tools').requireAll;

var ingredient = Schema({
  timestamp:    { type: Date, default: Date.now },
  creator:      { type: Schema.types.ObjectId, ref: 'Account' }, // FUTURE: Account
  name:         { type: String, index: { unique: true,
                                         dropDups: true } },
  purpose:      String,
  integrations: [{ type: Schema.types.ObjectId, ref: 'Integration' }]
});

requireAll(ingredient);

module.exports.ingredient = ingredient;
module.exports.FormulaIngredient = mongoose.model('FormulaIngredient', ingredient);
