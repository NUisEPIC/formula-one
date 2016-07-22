var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , Program = require('../models/program.js').Program
  , Application = require('../models/application.js').Application
  , Response = require('../models/response.js').Response
  , Person = require('../models/person.js').Person
  , basicAuth = require('basic-auth-connect');

/* TODO(jordan):
 *  - Split out the filtering logic into its own module
 *  - Update the confirmation mail function to use the new mail API
 *  - A way to update Programs, Applications, Questions in the Database
 *  - Better authentication system than Basic Auth. (node-jsonwebtoken.)
 *    - https://github.com/auth0/node-jsonwebtoken
 *    - JSON web tokens (JWT) to manage state
 *    - better hash our passwords though
 *      - we can use Node's built-in crypto library for that
 *
 */

require('dotenv').load();

var emailAuth = basicAuth(process.env.HTTP_BASIC_AUTH_USERNAME,
                          process.env.HTTP_BASIC_AUTH_PASSWORD);

var reviewAuth = basicAuth(process.env.APP_REVIEW_AUTH_USERNAME,
                           process.env.APP_REVIEW_AUTH_PASSWORD);

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.send('Heyo, there\'s no front door here. Maybe you got here by mistake?');
});

router.post('/:program/application/update/:filter', function(req, res) {
  var query = Response.find({});
  var filter = req.params.filter;
  filter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':');
    query = query.where(filterArg[0]).equals(filterArg[1]);
  });
  query.exec(function(err, doc) {
    if(err) console.log(err) && res.send(500, err);
    doc = doc[0];
    Object.assign(doc, req.body);
    doc.markModified('raw');
    doc.save(function(err) {
      if (err) console.log(err) && res.send(500, 'An error occurred while updating the document.');
      res.send(doc);
    });
  })
})

// FIXME(jordan): This needs to be replaced with more robust lookup logic.
router.get('/:program/application/list', reviewAuth, function (req, res) {

  Response.find({
    for: 'EPIC Fall Recruitment 2015'
  }, function (err, apps) {
    if (err) console.log(err) && res.send(500, 'Could not find apps');
    res.render('list', {applications: apps, path: req.path.slice(0,-5)});
  });
});

router.post('/:program/application', function(req, res) {
  Program.findOne({ shortname: req.params.program })
  .exec(function(err, program) {
    if (err) console.log(err) && res.send(500, 'Error executing query');

    console.log(program);

    console.log(req.body);

    Response.create({
      for: 'EPIC Fall Recruitment 2015',
      raw: req.body
    }, function(err, newResponse) {
      var responseId = newResponse._id;
      if(err) console.log(err) && res.send(500, 'Error executing query');
      // TODO(jordan): Update this to use the new mailer api.
      sendConfirmationEmail({
        name: req.body.name,
        email: req.body.email
      }, function(success) {
        console.log(success);
        newResponse.receivedConfirmationEmail = true;
        newResponse.markModified('receivedConfirmationEmail');
        newResponse.save(function() {
          console.log('Response received and confirmation email sent for ' + newResponse.raw.email);
        });
      }, function() {});
      res.send('Looks successful enough.');

      // TODO(jordan): add post('save') callback to Responses where if document.isNew, send verification email
    });
  });
});

// NOTE(jordan): LET'S BUILD TEH SUPERROUTE

router.get('/:program/:pfilter?/:endpoint/:efilter?/:action?', reviewAuth, function(req, res) {
  // NOTE(jordan): so many optional parameters!!!
  var program  = req.params.program
    , pfilter  = req.params.pfilter
    , endpoint = req.params.endpoint
    , efilter  = req.params.efilter
    , action   = req.params.action
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
    var f = filterArg.shift()
    var v = filterArg.join(':')
    console.log(f, v);
    if (f.charAt(0) == '~')
      query = query[f.slice(1)](v)
    else if (f == '_id')
      query = query.where(f).equals(v);
    else {
      if (v == 'true') v = true
      else v = rxsi(v)
      query = query.where(f).equals(v)
    }
  })

  console.log(pfilter)
  console.log(efilter)

  if (action == 'count') {
    query.count(send);
  } else if (action == 'view') {
    query.exec( function (err, data) {
      if (err) handleError(err);

      res.render('view', {app: data[0]})
    })
  } else if (action == 'list') {
    query.exec( function (err, data) {
      if (err) handleError(err);

      res.render('list', { applications: data })
    });
  } else {
    query.exec(send);
  }
})
