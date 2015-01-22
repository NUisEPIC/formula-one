var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

// TODO: improve integration schema
var integration = Schema({
  name: String,
  data: Schema.Types.Mixed
});

module.exports = mongoose.model('Integration', integration);
