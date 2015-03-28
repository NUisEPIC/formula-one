var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../plugins/schema-tools.js').requireAll;

var account = Schema({
  username: { type: String,
              index: { unique: true,
                       dropDups: true } },
  email:    { type: String,
              index: { unique: true,
                       dropDups: true } }
});

requireAll(account);

module.exports.account = account;
module.exports.Account = mongoose.model('Account', account);
