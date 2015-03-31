var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var response = Schema({
  raw: Schema.Types.Mixed,
  receivedConfirmationEmail: { type: Boolean, default: true }
  // FUTURE: parsed
});

module.exports.response = response;
module.exports.Response = mongoose.model('Response', response);
