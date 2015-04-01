var Response = require('./app/models/response.js').Response
  , sendConfirmationEmail = require('./confirmation-mailer.js').sendConfirmationEmail
  , sendStartupEmail = require('./confirmation-mailer.js').sendStartupEmail;

function sendUpdateEmails () {
  Response.find({receivedConfirmationEmail: { $exists: false } }, function(err, responses) {
    if (err) console.log(err);

    console.log(responses);

    responses.forEach(function(response) {
      // TEST -- remove before production run
      sendConfirmationEmail({
        user: {
          name: {
            first: response.raw.name.first,
            last: response.raw.name.last,
            full: response.raw.name.first + " " + response.raw.name.last
          },
          email: response.raw.email
        },
        account: {
          setupLink: "http://epic-talent-portal.herokuapp.com/register?email=" + response.raw.email + "&id=" + response._id,
          loginLink: "http://epic-talent-portal.herokuapp.com/#/login",
          alreadyApplied: false
        }
      }, function(success) {
        response.receivedConfirmationEmail = true;
        response.markModified('receivedConfirmationEmail');
        response.save(function() {
          console.log('Update sent and field set on ' + response.raw.email);
        });
      }, function(failure) {});
    });
  });
}

function sendStartupEmails () {
  var startups = require('./config/startups-masterlist.js');

  startups.forEach(function(startupArray) {
    if(startupArray[0] == 'skorlir@gmail.com') {
    sendStartupEmail({
      startup: {
        name: startupArray[1],
        email: startupArray[0],
        registrationLink: 'http://epic-talent-portal.herokuapp.com/register?email=' + startupArray[0] + '&special=reg_startup22619'
      }
    }, function (success) {
      console.log('Successfully send startup registration email to ' + startupArray[1] + ' <' + startupArray[0] + '>');
    }, function (failure) {});
    }
  })

  console.log('Done sending startup emails');
}

module.exports.sendUpdateEmails = sendUpdateEmails;
module.exports.sendStartupEmails = sendStartupEmails;
