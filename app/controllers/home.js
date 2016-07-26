var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , expressJWT = require('express-jwt')
  , jwt = require('jsonwebtoken')
  , Program = require('../models/program.js').Program
  , Application = require('../models/application.js').Application
  , Response = require('../models/response.js').Response
  , Person = require('../models/person.js').Person
  , User = require('../models/user.js').User

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

require('dotenv').load()

module.exports = function (app) {
  app.use('/', router)
}

// Require jwt authorization for all paths except '/' and '/authenticate'
router.use(expressJWT({ secret: process.env.SECRET_KEY }).unless({ path: ['/authenticate', '/'] }))

router.get('/', function (req, res, next) {
  res.send('Heyo, there\'s no front door here. Maybe you got here by mistake?')
})

router.post('/authenticate', function(req, res) {
    // Ensure required fields are provided
    if (!req.body.username || !req.body.password) {
        res.status(400).send('Username and password required.')
        return
    }

    // Authentication!
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) throw err

        if (!user) {
            res.status('400').send('Invalid credentials.')
            return
        }

        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err

            // If the password matches, return a json web token
            if (isMatch) {
                var token = jwt.sign({ username: req.body.username }, process.env.SECRET_KEY)
                res.status('200').json(token)
            } else {
                res.status('401').send('Invalid credentials.')
            }
        })
    })
})

router.post('/:program/application/update/:filter', function(req, res) {
  var query = Response.find({})
  var filter = req.params.filter
  filter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':')
    query = query.where(filterArg[0]).equals(filterArg[1])
  })
  query.exec(function(err, doc) {
    if(err) console.log(err) && res.send(500, err)
    doc = doc[0]
    Object.assign(doc, req.body)
    doc.markModified('raw')
    doc.save(function(err) {
      if (err) console.log(err) && res.send(500, 'An error occurred while updating the document.')
      res.send(doc)
    })
  })
})

// FIXME(jordan): This needs to be replaced with more robust lookup logic.
router.get('/:program/application/list', function (req, res) {

  Response.find({
    for: 'EPIC Fall Recruitment 2015'
  }, function (err, apps) {
    if (err) console.log(err) && res.send(500, 'Could not find apps')
    res.render('list', {applications: apps, path: req.path.slice(0,-5)})
  })
})

router.post('/:program/application', function(req, res) {
  Program.findOne({ shortname: req.params.program })
  .exec(function(err, program) {
    if (err) console.log(err) && res.send(500, 'Error executing query')

    console.log(program)

    console.log(req.body)

    Response.create({
      for: 'EPIC Fall Recruitment 2015',
      raw: req.body
    }, function(err, newResponse) {
      var responseId = newResponse._id
      if(err) console.log(err) && res.send(500, 'Error executing query')
      // TODO(jordan): Update this to use the new mailer api.
      sendConfirmationEmail({
        name: req.body.name,
        email: req.body.email
      }, function(success) {
        console.log(success)
        newResponse.receivedConfirmationEmail = true
        newResponse.markModified('receivedConfirmationEmail')
        newResponse.save(function() {
          console.log('Response received and confirmation email sent for ' + newResponse.raw.email)
        })
      }, function() {})
      res.send('Looks successful enough.')

      // TODO(jordan): add post('save') callback to Responses where if document.isNew, send verification email
    })
  })
})

const Actions = { }
Actions._handleError = (err, res) => {
  console.error(err)
  res.status(500).send('Whups, popped a gasket.')
}
Actions._send = (data, res) => {
  if (data == '' || data == [])
    res.send([])
  else res.send(isNaN(data) ? data : data.toString())
}
Actions._wrapWithErrorHandling = method => (query, req, res) => {
  query[method]((err, data) => {
    if (err) Actions._handleError(err, res)
    // NOTE(jordan): at this point if there was an error a response has been sent.
    else Actions._send(data, res)
  })
}

Actions.count = Actions._wrapWithErrorHandling('count')
Actions.fallback = Actions._wrapWithErrorHandling('exec')

const Endpoints = {
  'application': Response,
  'responses': Response,
  'response': Response,
}

function parseNumber (v) {
  if (~v.indexOf('.')) return parseFloat(v)
  else return parseInt(v)
}

function parseBoolean (v) {
  if (v === 'true') return true
  if (v === 'false') return false
  throw 'boolean parse error'
}

function parseValue (v) {
  try {
    return parseBoolean(v)
  } catch (e) { }
  try {
    return parseNumber(v)
  } catch (e) { }

  // NOTE(jordan): All string queries should be case insensitive.
  return new RegExp(val, 'i')
}

function parseArray (v) {
  return v.split(',').map(parseValue)
}

function parseKeyValuePair (key, value) {
  // NOTE(jordan): I have no idea how to support logical operators right now.
  //, logicalOperators     = [ 'and', 'or', 'not', 'nor' ]
  const arrayOperators     = [ 'all', 'in', 'nin' ]
      , valueOperators     = [ 'eq', 'ne' ]
      , numericOperators   = [ 'gt', 'gte', 'lt', 'lte', 'size' ]
      , booleanOperators   = [ 'exists' ]
      , operatorsWhitelist = [
        ...arrayOperators,
        ...valueOperators,
        ...numericOperators,
        ...booleanOperators,
      ]

  // Supports a subset of https://docs.mongodb.com/manual/reference/operator/query/
  if ( key.startsWith('$') ) {
    // Parse an operator.
    const operator = key.substr(1)
    try {
      if ( !~operatorsWhitelist.indexOf(operator) ) {
        return [ false, false ]
      } else if ( ~arrayOperators.indexOf(operator) ) {
        value = parseArray(value)
      } else if ( ~numericOperators.indexOf(operator) ) {
        value = parseNumber(value)
      } else if ( ~booleanOperators.indexOf(operator) ) {
        value = parseBoolean(value)
      } else if ( ~valueOperators.indexOf(operator) ) {
        value = parseValue(value)
      } else {
        // NOTE(jordan): Unfortunately, this shouldn't happen, and I shouldn't need this code.
        throw 'you are a bad programmer because that shit was supposed to be exhaustive'
      }
    } catch (e) {
      console.error(e)
      return [ false, false ]
    }
  } else {
    value = parseValue(value)
  }

  return [ key, value ]
}

function parseFilter (filterStr) {
  const kvPairs = filterStr.split(';').map(s => s.split(':'))
  let criteria  = { }

  for (const [ unparsedKey, unparsedValue ] of kvPairs) {
    const [ key, value ] = parseKeyValuePair(unparsedKey, unparsedValue)
    criteria[key] = value
  }

  return criteria
}

router.get('/:program/:pfilter?/:endpoint/:efilter?/:action?', function(req, res) {
  // NOTE(jordan): All queries should be 'startsWith' and case insensitive.
  const rxsi = val => new RegExp('^' + val, 'i')

  // NOTE(jordan): Predicates for filter parsing.
  // LIMITATION: Cannot write queries containing ":" or ";".
  const keyValuePairRx = /^([^:,]+):([^:,]+)$/
      , filterRx = /^([^:,]+):([^:,]+)(?:,([^:,]+):([^:,]+))*/
  const isFilter = str => filterRx.test(str)

  // NOTE(jordan): Extract route parameters.
  const { program, pfilter, endpoint, efilter, action } = req.params

  // NOTE(jordan): Clean up route parameters.
  // If pfilter is not a filter, move everything after pfilter back one.
  if ( !isFilter(pfilter) )
    action = efilter, efilter = endpoint, endpoint = pfilter, pfilter = undefined
  // If efilter is not a filter, move everything after efilter back one.
  if ( !isFilter(efilter) )
    action = efilter, efilter = undefined

  if ( !endpoint in Endpoints ) {
    res.status(400).send('You done did not give a good endpoint.')
  }

  let query = Endpoints[endpoint].find({})

  // TODO(jordan): same for pfilter...
  if (pfilter) {
    let programCriteria = parseFilter(pfilter)
  }

  if (efilter) {
    let endpointCriteria = parseFilter(efilter)
  }

  efilter && efilter.split(',').forEach(function(filterArg) {
    filterArg = filterArg.split(':')
    var f = filterArg.shift()
    var v = filterArg.join(':')
    console.log(f, v)
    if (f.charAt(0) == '~')
      query = query[f.slice(1)](v)
    else if (f == '_id')
      query = query.where(f).equals(v)
    else {
      if (v == 'true') v = true
      else v = rxsi(v)
      query = query.where(f).equals(v)
    }
  })

  console.log(pfilter)
  console.log(efilter)

  if (action in Actions) {
    Actions[action](query, req, res)(send)
  } else {
    query.exec(send)
  }
})
