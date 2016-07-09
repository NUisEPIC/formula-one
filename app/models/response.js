var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var response = Schema({
  for: {
    type: String,
  },
  raw: Schema.Types.Mixed,
  receivedConfirmationEmail: {
    type: Boolean,
  },
});

module.exports.response = response;
module.exports.Response = mongoose.model('Response', response);
