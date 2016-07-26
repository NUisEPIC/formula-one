var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var application = Schema({
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
    index: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }
  ],
  schedule: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
})

application.virtual('responses', {
  ref: 'Response',
  localField: '_id',
  foreignField: 'application',
})

var Application = mongoose.model('Application', application)

module.exports.application = application
module.exports.Application = Application
