
module.exports.requireAll = function(schema) {
  Object.keys(schema.paths).forEach(function(key) {
    schema.paths[key]['isRequired'] = true;
    schema.tree[key]['required'] = true;
  });
}
