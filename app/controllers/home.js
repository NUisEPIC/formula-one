var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , Program = require('../models/program.js').Program
  , Application = require('../models/application.js')
  , Response = require('../models/response.js').Response
  , Person = require('../models/person.js').Person
  , ObjectId = require('mongoose').Types.ObjectId
  , sendConfirmationEmail = require('../../confirmation-mailer.js').sendConfirmationEmail
  , _ = require('underscore');

require('dotenv').load();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.send('Heyo, there\'s no front door here. Maybe you got here by mistake?');
});

router.post('/:program/application/update/:filter', function(req, res) {
  var query = Response.find({});
  var filter = req.params.filter;
  console.log(filter);
  filter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':');
    query = query.where(filterArg[0]).equals(filterArg[1]);
  });
  query.exec(function(err, doc) {
    if(err) console.log(err) && res.send(500, err);
    doc = doc[0];
    _.extend(doc, req.body);
    doc.markModified('raw');
    doc.save(function(err) {
      if (err) console.log(err) && res.send(500, 'An error occurred while updating the document.');
      res.send(doc);
    });
  })
})

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

// NOTE(jordan): LET'S BUILD TEH SUPERROUTE

router.get('/:program/:pfilter?/:endpoint/:efilter?/:action?', function(req, res) {
  // NOTE(jordan): so many optional parameters!!!
  var program   = req.params.program
    , pfilter   = req.params.pfilter
    , endpoint  = req.params.endpoint
    , efilter   = req.params.efilter
    , action    = req.params.action
    , query;

  var handleError = function(err) {
    if(err) console.log(err) && res.send(500, 'Whoa, popped a gasket. Whoops.');
  }

  var send = function(err, data) {
    if (err) handleError(err);
    if (data == '' || data == [])
      res.send([]);
    else res.send(isNaN(data) ? data : data.toString());
  }

  // NOTE(jordan): all queries should be 'startsWith' and case insensitive
  var rxsi = function (val) { return new RegExp('^' + val, 'i'); }

  if (pfilter && pfilter.indexOf(':') < 0)
    action = efilter, efilter = endpoint, endpoint = pfilter, pfilter = undefined;
  if (efilter && efilter.indexOf(':') < 0)
    action = efilter, efilter = undefined;

  if(endpoint == 'application') {
    query = Response.find({});
  }

  // TODO(jordan): same for pfilter...

  efilter && efilter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':');
    if (filterArg[0].charAt(0) == '~')
      query = filterArg.length == 2
        ? query[filterArg[0].slice(1)](filterArg[1])
        : query;
    else if (filterArg[0] == '_id')
      query = query.where(filterArg[0]).equals(filterArg[1]);
    else query = filterArg.length == 2
      ? query.where(filterArg[0]).equals(rxsi(filterArg[1]))
      : query.where(filterArg[0])[filterArg[1]](rxsi(filterArg[2]));
  })

  if (action == 'count') {
    query.count(send);
  } else {
    query.exec(send);
  }
})
