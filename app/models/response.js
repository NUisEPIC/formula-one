var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var response = Schema({
  raw: Schema.Types.Mixed
  // FUTURE: parsed
});

module.exports.response = response;
module.exports.Response = mongoose.model('Response', response);
