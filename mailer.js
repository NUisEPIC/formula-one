var mailgun = require('mailgun-js')({apiKey: "key-0427e9f62f466535f9d41e5f8d45184f", domain: "nuisepic.com"})
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
