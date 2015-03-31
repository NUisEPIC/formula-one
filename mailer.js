var Response = require('../models/response.js')
, sendConfirmationEmail = require('../../confirmation-mailer.js').sendConfirmationEmail;

function sendUpdateEmails () {
  Response.find({receivedConfirmationEmail: { $exists: false } }, function(err, reponses) {
    if (err) console.log(err) && res.send(500, 'Error sending update emails.');

    console.log(responses);

    if (responses.length <= 0) res.send(500, 'No one to send update emails to.');

    responses.forEach(function(response) {
      // TEST -- remove before production run
      if (response.raw.email != 'jtim@u.northwestern.edu') continue;
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
        console.log(success);
        response.receivedConfirmationEmail = true;
        response.markModified('receivedConfirmationEmail');
        response.save(function() {
          console.log('Update sent and field set on ' + response.raw.email);
        });
      }, function(failure) {
        console.log(failure)
      });
    });
  });
}

module.exports = sendUpdateEmails;
