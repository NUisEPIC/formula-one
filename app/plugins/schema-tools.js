
module.exports.requireAll = function(schema) {
  Object.keys(schema).forEach(function(key) {
    schema[key].required = true;
  });
}
