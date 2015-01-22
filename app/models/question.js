var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var question = Schema({
  text: String
  // FUTURE: type, format, input_id, validator
});

module.exports.question = question;
module.exports.Question = mongoose.model('Question', question);
