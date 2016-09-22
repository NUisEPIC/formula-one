require('dotenv').load()

var mailgun = require('mailgun-js')({apiKey: process.env.API_KEY, domain: "nuisepic.com"})
var accord  = require('accord')

/// Options: object containing template, variables, engine
module.exports = function (data, options, callback) {
  renderer = accord.load(options.engine)

  renderer.render(options.template, options.variables)
    .done(function (res) {
      data.html = res.result

      mailgun.messages().send(data, function (error, body) {
        callback(error, body)
      })
    })
}
