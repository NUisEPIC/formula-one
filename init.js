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

// Manually create desired questions
var q1 = new Question({text: 'First Name'})
  , q2 = new Question({text: 'Last Name'})
  , q3 = new Question({text: 'School Email'})
  , q4 = new Question({text: 'Class Year (e.g. 2017)'})
  , q5 = new Question({text: 'Major'})
  , q6 = new Question({text: 'Phone Number'});

var q7 = new ChooseMany({
    text: 'Where do you see yourself in EPIC? Select as many as apply.',
    type: 'chooseMany',
    questionOptions: [
        'EPIC General Membership',
        'EPIC Team',
        'EPIC Launch Cohort',
        'EPIC Sprout Participant',
    ],
});

var q8 = new Question({text: 'What do you want to get out of your membership?'})
  , q9 = new Question({text: 'What’s your story? Tell us about yourself. (ex: What are you passionate about? What was your journey to NU?)'})
  , q10 = new Question({text: 'What do you hope to learn, or what skills do you hope to gain from joining EPIC?'})
  , q11 = new Question({text: 'Why are you passionate about entrepreneurship? (Feel free to tell us about any entrepreneurial experience you have.)'})
  , q12 = new Question({text: 'What will you contribute to the specific team you are interested in? (How do you see yourself fitting in?)'})
  , q13 = new Question({text: 'What else are you involved in? (work-study, other student orgs, study abroad, etc.) Do you have any work that you\’re proud of? (Feel free to attach a portfolio, a link to your personal website, a writing sample, etc.)'})
  , q14 = new Question({text: 'What do you want to get out of Launch?'});

var recruitmentApp = new Application({
    responses: [],
    questions: [ q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14 ],
});

recruitmentApp.save(function (err, newApplication) {
    if (err) {
        console.log(err);
        process.exit();
    }
    else {
        Program.update(
            {
                shortname: 'recruitment'
            },
            {
                $set: {
                    currentlyLiveApplication: newApplication._id
                }
            },
            function() {
                console.log('Recruitment currentlyLiveApplication set to ' + newApplication._id);
                process.exit();
            }
        );
    }
});
