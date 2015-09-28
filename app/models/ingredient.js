var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ingredient = Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  creator: String,
  name: {
    type: String,
    index: {
      unique: true,
      dropDups: true
    }
  },
  purpose: String
});

module.exports.ingredient = ingredient;
module.exports.Ingredient = mongoose.model('Ingredient', ingredient);
