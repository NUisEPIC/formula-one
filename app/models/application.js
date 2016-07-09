var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var application = Schema({
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
});

var Application = mongoose.model('Application', application);

module.exports.application = application;
module.exports.Application = Application;
