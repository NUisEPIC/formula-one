var User = require('./app/models/user.js').User
  , mongoose = require('mongoose')
  , config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

require('dotenv').load();

var user = new User({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
});

user.save(function(err, newUser) {
    if (err) console.log(err);
    else console.log('Successfully initialized user.');
    process.exit();
});
