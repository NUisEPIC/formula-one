var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var application = Schema({
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
    index: true,
  },
  responses: [
    {
      type: Schema.Types.ObjectId,
      ref:  'Response',
    }
  ],
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }
  ],
})

var Application = mongoose.model('Application', application)

module.exports.application = application
module.exports.Application = Application
