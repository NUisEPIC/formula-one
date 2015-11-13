var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var question = Schema({
  text: String,
  type: {
    type: Schema.Types.ObjectId,
    ref : 'Ingredient'
  },
  ingredients: [ {
    type: Schema.Types.ObjectId,
    ref : 'Ingredient'
  } ]
});

module.exports.question = question;
module.exports.Question = mongoose.model('Question', question);
