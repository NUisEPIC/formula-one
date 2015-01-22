var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'formula-one'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGOLAB_URI || 'mongodb://localhost/formula-one-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'formula-one'
    },
    port: 3000,
    db: 'mongodb://localhost/formula-one-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'formula-one'
    },
    port: 3000,
    db: 'mongodb://localhost/formula-one-production'
  }
};

module.exports = config[env];
