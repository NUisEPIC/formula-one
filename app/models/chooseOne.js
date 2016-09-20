var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Question = require('./question').Question

var chooseOne = new Schema({
    options: [
        {
            type: String,
            required: true,
        }
    ],
});

var ChooseOne = Question.discriminator('ChooseOne', chooseOne);

module.exports.chooseOne = chooseOne;
module.exports.ChooseOne = ChooseOne;
