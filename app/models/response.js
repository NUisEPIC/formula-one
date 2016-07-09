var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var response = Schema({
  application: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Application',
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Answer',
    }
  ],
});

module.exports.response = response;
module.exports.Response = mongoose.model('Response', response);
