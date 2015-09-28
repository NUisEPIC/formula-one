var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../lib/schema-tools.js').requireAll

var account = Schema({
});

requireAll(account);

module.exports.account = account;
module.exports.Account = mongoose.model('Account', account);
