var mongoose = require('mongoose')
  , config = require('./config/config')
  , Application = require('./app/models/application.js').Application
  , Question = require('./app/models/question.js').Question
  , ChooseMany = require('./app/models/chooseMany.js').ChooseMany
  , ChooseOne = require('./app/models/chooseOne.js').ChooseOne
  , Program = require('./app/models/program.js').Program;

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

var recruitmentProgram = new Program({
    name: 'Fall Recruitment 2016',
    shortname: 'recruitment',
    description: 'Fall Recruitment 2016',
    startYear: 2016,
});

recruitmentProgram.save(function(err, newProgram) {
    if (err) console.log(err);
    else console.log('Successfully initialized 2016 fall recruitment program.');
    process.exit();
});
