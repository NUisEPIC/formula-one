var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var question = Schema({
  text: String
  // FUTURE: type, format, input_id, validator
});

module.exports = mongoose.model('Question', question);
