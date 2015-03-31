var Response = require('./app/models/response.js').Response
, sendConfirmationEmail = require('./confirmation-mailer.js').sendConfirmationEmail;

function sendUpdateEmails () {
  Response.find({receivedConfirmationEmail: { $exists: false } }, function(err, responses) {
    if (err) console.log(err) && res.send(500, 'Error sending update emails.');

    console.log(responses);

    if (responses.length <= 0) res.send(500, 'No one to send update emails to.');

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

module.exports = sendUpdateEmails;
