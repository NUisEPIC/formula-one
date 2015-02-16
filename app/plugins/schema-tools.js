module.exports.requireAll = function(schema) {
    console.log(schema.tree);
    console.log("\n==--==--==--==--==\n");
  for (var p in schema.paths) {
    console.log(p);
    //console.log(schema.path(p));
    if (p.indexOf('_') != 0) schema.path(p).required(true);
  }
}
