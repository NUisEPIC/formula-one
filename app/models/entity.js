var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var entity = Schema({
  name: String,
  joinDate: { type: Date,
              default: Date.now },
  //FUTURE: associations: [association]
});

module.exports.entity = entity;
module.exports.Entity = mongoose.model('Entity', entity);
