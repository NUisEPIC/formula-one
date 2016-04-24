var mailgun = require('mailgun-js')({apiKey: "key-0427e9f62f466535f9d41e5f8d45184f", domain: "nuisepic.com"})
var data = {
    from: "murphycangelo@gmail.com",
    to: "murphycangelo@gmail.com",
    subject: "Test",
    text: "this is test"
}
mailgun.messages().send(data, function (error, body) {
    console.error(error)
    console.log(body)
})
