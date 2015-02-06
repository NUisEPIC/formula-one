var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , Program = require('../models/program.js')
  , Application = require('../models/application.js')
  , Response = require('../models/response.js').Response
  , ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'Generator-Express MVC',
  });
});

router.get('/setup', function(req, res) {
  var application = new Application({name: "scf2015",
                                     responses: [],
                                     respondents: []});
  application.save(function(err) {
    if(err) console.log(err);
    Application.findOne({name: "scf2015"}).exec(function(err, application) {
      new Program({name: "Startup Career Fair",
                   shortname: "scf",
                   description: "",
                   dates: [{end: Date.now() + 1000 * 60 * 60 * 24 * 30}],
                   ingredients: [application]}).save(function(err) {
        if(err) console.log(err);
        res.send('Hey! It looks like it worked.');
      });
    });
  });
});

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
    
    Response.create({
      raw: req.body
    }, function(err, newResponse) {
      console.log(newResponse);
      Application.findOneAndUpdate({ _id: ObjectId(application._id) }
                                  ,{$push: {responses: newResponse}})
      .exec(function(err, application) {
        if(err) console.log(err) && res.send(500, 'Error executing query');
        res.send('Looks successful enough.');
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
