var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , Program = require('../models/program.js')
  , Application = require('../models/application.js')
  , Response = require('../models/response.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.post('/:program/application', function(req, res) {
  Program.find({ name: req.params.program })
  .exec(function(err, program) {
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

router.post('/:program/:filter/application', function(req, res) {
  var query = Program.find({name: req.params.program});
  
  req.params.filter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':');
    if (filterArg.length > 1 && filterArg.length <= 3) { 
      filterArg.length == 2 
        ? query.where(filterArg[0]).equals(filterArg[1])
        : query.where(filterArg[0])[filterArg[1]](filterArg[2]);
    } else {
      res.send(400, 'Malformed :filter');
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
