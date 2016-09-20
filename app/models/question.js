var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var question = Schema({
  text: String,
  questionType: {
      type: String,
      enum: ['freeResponse', 'chooseOne', 'chooseMany'],
      default: 'freeResponse',
  },
});

module.exports.question = question;
module.exports.Question = mongoose.model('Question', question);
