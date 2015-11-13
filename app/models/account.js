var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var account = Schema({
});

module.exports.account = account;
module.exports.Account = mongoose.model('Account', account);
