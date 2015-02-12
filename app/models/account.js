var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , requireAll = require('../plugins/schema-tools.js').requireAll
  , Entity   = require('./entity.js').Entity;

var account = Schema({
  username: { type: String,
              index: { unique: true,
                       dropDups: true }},
  hash:     String
});

requireAll(account);

module.exports.Account = Entity.discriminator('Account', account);
