var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Question = require('./question').Question

var chooseMany = new Schema({
    options: [
        {
            type: String,
            required: true,
        }
    ],
});

var ChooseMany = Question.discriminator('ChooseMany', chooseMany);

module.exports.chooseMany = chooseMany;
module.exports.ChooseMany = ChooseMany;
