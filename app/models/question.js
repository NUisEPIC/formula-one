var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var question = Schema({
  application: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Application',
  },
  // TODO(jordan): We have yet to figure out the actual model for the question.
  // NOTE(jordan): Suppose this is markdown formatted?
  prompt: String,
  //type: QuestionType,
})

module.exports.question = question
module.exports.Question = mongoose.model('Question', question)
