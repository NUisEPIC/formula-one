var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

module.exports.requireAll = function(schema) {
    console.log(schema.tree);
    console.log("\n==--==--==--==--==\n");
  for (var p in schema.paths) {
    console.log(p);
    //console.log(schema.path(p));
    if (p.indexOf('_') != 0) schema.path(p).required(true);
  }
}

module.exports.Schema = function(data) {
  var schema = Schema(data);
  var denorm = Schema();
  schema.is = function(Model) {
    for (var p in Model.paths) {
      if (p.slice(0, 1) != '_') {
        denorm[p] = Model.path(p);
      }
    }
  }
}
