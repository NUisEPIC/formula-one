var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var question = Schema({
  text: String,
  //type: QuestionType,
});

module.exports.question = question;
module.exports.Question = mongoose.model('Question', question);
