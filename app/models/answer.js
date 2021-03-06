var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var answer = Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  textContent: {
    type: String,
    required: true,
  },
});

module.exports.answer = answer;
module.exports.Answer = mongoose.model('Answer', answer);
