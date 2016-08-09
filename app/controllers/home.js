var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , expressJWT = require('express-jwt')
  , jwt = require('jsonwebtoken')
  , Program = require('../models/program.js').Program
  , Application = require('../models/application.js').Application
  , Response = require('../models/response.js').Response
  , Question = require('../models/question.js').Question
  , Person = require('../models/person.js').Person
  , User = require('../models/user.js').User
  , util = require('util')

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

// router.post('/:program/application/update/:filter', function(req, res) {
//   var query = Response.find({})
//   var filter = req.params.filter
//   filter.split(',').forEach(function(filterArg) {
//     filterArg = filterArg.split(':')
//     query = query.where(filterArg[0]).equals(filterArg[1])
//   })
//   query.exec(function(err, doc) {
//     if(err) console.log(err) && res.send(500, err)
//     doc = doc[0]
//     Object.assign(doc, req.body)
//     doc.markModified('raw')
//     doc.save(function(err) {
//       if (err) console.log(err) && res.send(500, 'An error occurred while updating the document.')
//       res.send(doc)
//     })
//   })
// })

// FIXME(jordan): This needs to be replaced with more robust lookup logic.
// router.get('/:program/application/list', function (req, res) {

//   Response.find({
//     for: 'EPIC Fall Recruitment 2015'
//   }, function (err, apps) {
//     if (err) console.log(err) && res.send(500, 'Could not find apps')
//     res.render('list', {applications: apps, path: req.path.slice(0,-5)})
//   })
// })

// router.post('/:program/application', function(req, res) {
//   Program.findOne({ shortname: req.params.program })
//   .exec(function(err, program) {
//     if (err) console.log(err) && res.send(500, 'Error executing query')

//     console.log(program)

//     console.log(req.body)

//     Response.create({
//       for: 'EPIC Fall Recruitment 2015',
//       raw: req.body
//     }, function(err, newResponse) {
//       var responseId = newResponse._id
//       if(err) console.log(err) && res.send(500, 'Error executing query')
//       // TODO(jordan): Update this to use the new mailer api.
//       sendConfirmationEmail({
//         name: req.body.name,
//         email: req.body.email
//       }, function(success) {
//         console.log(success)
//         newResponse.receivedConfirmationEmail = true
//         newResponse.markModified('receivedConfirmationEmail')
//         newResponse.save(function() {
//           console.log('Response received and confirmation email sent for ' + newResponse.raw.email)
//         })
//       }, function() {})
//       res.send('Looks successful enough.')

//       // TODO(jordan): add post('save') callback to Responses where if document.isNew, send verification email
//     })
//   })
// })

const Actions = { }
Actions._handleError = (err, res) => {
  console.error(err)
  res.status(500).send('Whups, popped a gasket.')
}
Actions._send = (data, req, res) => {
  if (data === null || data === '' || data === [])
    res.send([])
  else res.send(isNaN(data) ? data : data.toString())
}
Actions._wrapWithErrorHandling = method => (query, req, res) => action => {
  query[method]((err, data) => {
    if (err) Actions._handleError(err, res)
    // NOTE(jordan): at this point if there was an error a response has been sent.
    else if (action && typeof action === 'string' && action in Actions)
      Actions[action](data, req, res)
    else if (action && typeof action === 'function')
      action(data, req, res)
    else
      Actions._send(data, req, res)
  })
}

Actions.count = Actions._wrapWithErrorHandling('count')
Actions.fallback = Actions._wrapWithErrorHandling('exec')

const Endpoints = {
  'response': Response,
  'question': Question,
}

Endpoints.responses = Endpoints.response
Endpoints.questions = Endpoints.question

function parseNumber (v) {
  if (~v.indexOf('.')) v = parseFloat(v)
  else v = parseInt(v)

  if (isNaN(v)) throw `number parse error`
  else return v
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
  return new RegExp(v, 'i')
}

function parseArray (v) {
  if (!(typeof v === 'string' && v.length > 0))
    throw 'array parse error'
  return v.split(',').map(parseValue)
}

function parseKeyValuePair (key, value) {
  // NOTE(jordan): I have no idea how to support logical operators right now.
  //, logicalOperators     = [ 'and', 'or', 'not', 'nor' ]
  const arrayOperators     = [ 'all', 'in', 'nin' ]
      , numericOperators   = [ 'gt', 'gte', 'lt', 'lte', 'size' ]
      , booleanOperators   = [ 'exists' ]
      , valueOperators     = [ 'eq', 'ne' ]
      , operatorsWhitelist = [
        ...arrayOperators,
        ...valueOperators,
        ...numericOperators,
        ...booleanOperators,
      ]

  const specialOperators   = [ 'sort', 'limit', 'skip', 'slice', 'push' ]

  let parsedValue

  console.log(`Parse KV: ${key}, ${value}`)

  if ( specialOperators.some(op => ~key.indexOf(op)) ) {
    console.log(`Parse: special operator: ${key}`)
    const [ operator ] = key.split(':')
    key = operator
    parsedValue = value
    // TODO(jordan): Support $push and etc. here

  } else if ( ~value.indexOf('$') ) {
    // Supports a subset of https://docs.mongodb.com/manual/reference/operator/query/
    console.log(`Parse: operator in: ${value}`)
    const [ operator, arg ] = value.split(':')
    console.log(`Operator: ${operator}, Value: ${arg}`)
    parsedValue = {}
    try {
      if ( !operatorsWhitelist.some(op => ~value.indexOf(`$${op}`)) ) {
        console.log(`Parse: bad operator.`)
        throw `Parse: Bad operator.`
      } else if ( ~arrayOperators.indexOf(operator.substr(1)) ) {
        console.log(`Parse: array operator`)
        parsedValue[operator] = parseArray(arg)
      } else if ( ~numericOperators.indexOf(operator.substr(1)) ) {
        console.log(`Parse: numeric operator`)
        parsedValue[operator] = parseNumber(arg)
      } else if ( ~booleanOperators.indexOf(operator.substr(1)) ) {
        console.log(`Parse: boolean operator`)
        parsedValue[operator] = arg ? parseBoolean(arg) : true
      } else if ( ~valueOperators.indexOf(operator.substr(1)) ) {
        console.log(`Parse: value operator`)
        parsedValue[operator] = parseValue(arg)
      } else {
        /* NOTE(jordan): Unfortunately, this shouldn't happen, and I shouldn't need this code.
         *   But JavaScript is a fundamentally unsafe language.
         */
        throw 'you are a bad programmer because that shit was supposed to be exhaustive'
      }
    } catch (e) {
      console.error(`[caught error]:`, e)
      return [ false, false ]
    }

  } else {
    parsedValue = parseValue(value)
  }

  return [ key, parsedValue ]
}

function splitOnFirst (str, c) {
  const i = str.indexOf(c)
  return ~i ? [ str.substr(0, i), str.substr(i + 1) ] : str
}

function parseFilter (filterStr) {
  // Tokenize
  const kvPairs = filterStr.split(';')
                           .filter(s => s.length > 0)
                           .map(s => splitOnFirst(s, ':'))
                           .map(pts => [ pts[0], pts.slice(1).join(':') ])
                           .filter(([k, v]) => k.length > 0 && !!v)
  let criteria  = { }

  // Then structure
  for (const [ unparsedKey, unparsedValue ] of kvPairs) {
    const [ key, value ] = parseKeyValuePair(unparsedKey, unparsedValue)
    if (key && value) criteria[key] = value
  }

  return criteria
}

function mapCriteriaToMongoose (criteria) {
  // Output: Array: [ { method: [ ...args] }, ... ]
  const clauses = []

  for (let fieldOrOperator of Object.keys(criteria)) {
    const value     = criteria[fieldOrOperator]
        , valueKeys = Object.keys(value)
    if (fieldOrOperator.startsWith('~')) {
      // Special operator.
      // Strip the leading '~'.
      const op = fieldOrOperator.substr(1)
      clauses.push({ [op]: value.split(',') })
    } else if (valueKeys.length > 0) {
      // Has to be an operator.
      // Let us assume, that there is only one operator.
      const op = valueKeys[0]
          , arg = value[op]
      clauses.push({ where: [ fieldOrOperator ] })
      // Strip the leading '$' from op.
      clauses.push({ [op.substr(1)]: [ arg ] })
    } else {
      // This is the simple case.
      clauses.push({ where: [ fieldOrOperator ] })
      clauses.push({ equals: [ value ] })
    }
  }

  return clauses
}

//router.get('/:program/:pfilter?/application/:action?')

router.get('/:program/:pfilter?/:endpoint?/:efilter?/:action?', function(req, res) {
  // NOTE(jordan): Predicates for filter parsing.
  // LIMITATION: Cannot write queries containing "$", ":", or ";".
  const keyValuePairRx = /^([^:,]+):([^:,]+)$/
      , filterRx = /^([^:,]+):([^,]+)(?:;([^:,]+):([^:,]+))*/
  const isFilter = str => filterRx.test(str)

  // NOTE(jordan): Extract route parameters.
  let { program, pfilter, endpoint, efilter, action } = req.params

  console.log(`Da kine biggun super route received request.`)
  console.log(` ^^^ that might be racist and you should be careful what you say.`)
  console.log(` → Hawai'i pidgin is a legitimate language!`)
  console.log(`
    params:
      0: ${program}
      1: ${pfilter}
      2: ${endpoint}
      3: ${efilter}
      4: ${action}
  `)

  if ( !pfilter ) {
    // NOTE(jordan): This has to be a program query w/o an Action.
    const query = Program.findOne({ $or: [{ shortname: program }, { name: program }] })
                         .select('-_id -__v')
    return Actions.fallback(query, req, res)()
  }

  // NOTE(jordan): Clean up route parameters.
  // If pfilter is not a filter, move everything after pfilter back one.
  if ( pfilter !== undefined && !isFilter(pfilter) )
    action = efilter, efilter = endpoint, endpoint = pfilter, pfilter = undefined
  // If efilter is not a filter, move everything after efilter back one.
  if ( efilter !== undefined && !isFilter(efilter) )
    action = efilter, efilter = undefined

  console.log(`
    parsed params:
      program: ${program}
      pfilter: ${pfilter}
      endpoint: ${endpoint}
      efilter: ${efilter}
      action: ${action}
  `)

  if ( !(endpoint in Endpoints) ) {
    return res.status(400).send('You done did not give a good endpoint.')
  }

  let applicationClauses = []

  if (pfilter) {
    console.log(`Found an application filter: ${pfilter}.`)
    applicationCriteria = parseFilter(pfilter)
    console.log(`Parsed:`, applicationCriteria)
    clauses = mapCriteriaToMongoose(applicationCriteria)
    console.log(`Mapped to clauses:`, util.inspect(clauses, { depth: null }))
  }

  const applicationQuery = Application.find()
  // Now apply the clauses.

  let endpointClauses = []

  if (efilter) {
    console.log(`Found an endpoint filter: ${efilter}.`)
    endpointCriteria = parseFilter(efilter)
    console.log(`Parsed:`, endpointCriteria)
    clauses = mapCriteriaToMongoose(endpointCriteria)
    console.log(`Mapped to clauses:`, util.inspect(clauses, { depth: null }))
  }

  // NOTE(jordan): This silly map would be easier to create if we were using ES6 Imports.
  const endpointQuery = Endpoints[endpoint].find()
  // Now apply the clauses.

  return res.status(200).send()

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
