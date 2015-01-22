var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var dateRange = new Schema({
  start:  { type: Date, default:  Date.now },
  end:    { type: Date }
});

module.exports = mongoose.model('DateRange', dateRange);
