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
  sentConfirmationEmail: {
      type: Boolean,
      default: false,
      required: true,
  },
  // In lieu of an actual user
  email: {
      type: String,
      required: true,
  },
  firstName: {
      type: String,
      required: true,
  },
  lastName: {
      type: String,
      required: true,
  },
});

module.exports.response = response;
module.exports.Response = mongoose.model('Response', response);
