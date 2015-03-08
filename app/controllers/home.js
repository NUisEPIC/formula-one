var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , Program = require('../models/program.js').Program
  , Application = require('../models/application.js')
  , Response = require('../models/response.js').Response
  , Person = require('../models/person.js').Person
  , ObjectId = require('mongoose').Types.ObjectId
  , sendConfirmationEmail = require('../../confirmation-mailer.js').sendConfirmationEmail;

require('dotenv').load();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.send('Heyo, there\'s no front door here. Maybe you got here by mistake?');
});

/*router.get('/setup', function(req, res) {
  var application = new Application({name: "scf2015",
                                     responses: [],
                                     respondents: []});
  application.save(function(err) {
    if(err) console.log(err);
    Application.findOne({name: "scf2015"}).exec(function(err, application) {
      new Program({name: "Startup Career Fair",
                   shortname: "scf",
                   description: "Startup Career Fair",
                   dates: [{end: Date.now() + 1000 * 60 * 60 * 24 * 30}],
                   ingredients: [application]}).save(function(err) {
        if(err) console.log(err);
        res.send('Hey! It looks like it worked.');
      });
    });
  });
});*/

router.post('/:program/application', function(req, res) {
  Program.findOne({ shortname: req.params.program })
  .exec(function(err, program) {
    if (err) console.log(err) && res.send(500, 'Error executing query');

    console.log(program);

    var application = [].filter.call(program.ingredients, function(ingredient) {
      return !!ingredient.questions
             && !!ingredient.responses;
    })[0];

    console.log(req.body);

    Person.create({
      name: { first: req.body.name.first, last: req.body.name.last },
      gender: req.body.gender
    }, function(err, person) {
      if(err) console.log(err);
      else console.log("Person " + person.name.first + " " + person.name.last + " successfully created.");
    });

    Response.create({
      raw: req.body
    }, function(err, newResponse) {
      console.log(newResponse);
      Application.findOneAndUpdate({ _id: ObjectId(application._id) }
                                  ,{$push: {responses: newResponse}})
      .exec(function(err, application) {
        if(err) console.log(err) && res.send(500, 'Error executing query');
        sendConfirmationEmail({
          user: {
            name: {
              first: req.body.name.first,
              last: req.body.name.last,
              full: req.body.name.first + " " + req.body.name.last
            },
            email: req.body.email,
            hasAccount: false
          },
          account: {
            setupLink: "#",
            resetLink: "#",
            loginLink: "http://epic-talent-portal.herokuapp.com/#/login"
          }
        }, function() {}, function() {});
        res.send('Looks successful enough.');

        // TODO(jordan): add post('save') callback to Responses where if document.isNew, send verification email
      });
    });
  });
});

router.post('/:program/:filter/application', function(req, res) {
  var query = Program.find({shortname: req.params.program});

  req.params.filter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':');
    if (filterArg.length > 1 && filterArg.length <= 3) {
      filterArg.length == 2
        ? query.where(filterArg[0]).equals(filterArg[1])
        : query.where(filterArg[0])[filterArg[1]](filterArg[2]);
    } else {
      res.send(400, 'Malformed filter');
    }
  });

  query.exec(function(err, program) {
    if (err) console.log(err) && res.send(500, 'Error executing query');

    var application = program.ingredients.filter(function(ingredient) {
      return !!ingredient.questions
             && !!ingredient.responses;
    });

    Application.findOne({ _id: ObjectId(application._id) })
    .exec(function(err, application) {
      if(err) console.log(err) && res.send(500, 'Error executing query');

      var newResponse = Response.create({
        raw: req.post
      });

      application.responses.push(newResponse);
    });
  });
});
