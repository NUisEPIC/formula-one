var mandrill = require('mandrill-api/mandrill');

exports.sendConfirmationEmail = function(templateData, success, failure) {
  var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
  mandrill_client.messages.sendTemplate({
    "template_name": "SCF Confirmation Email with Account",
    "template_content" : {}, // there are no mc:edit fields
    "message": {
      "subject": "Thanks for signing up for Startup Career Fair 2015, " + templateData.user.name.full + "!",
      "to": [{ "email": templateData.user.email,
                "name": templateData.user.name.full
             }],
      "important": false,
      "track_opens": true,
      "track_clicks": true,
      "merge_language": "handlebars",
      "global_merge_vars": [
        { "name": "programVerbPhrase",
          "content": "signing up for"},
        { "name": "programName",
          "content": "Startup Career Fair 2015"},
        { "name": "teamName",
          "content": "SCF Team"},
        { "name": "loginLink",
          "content": "http://epic-talent-portal.herokuapp.com/#/login"},
        { "name": "additionalTextContent",
          "content": "And again, make sure to upload your most recent resume to your account before the Fair!"}
      ],
      "merge_vars": [
        {
          "rcpt": templateData.user.email,
          "vars": [
            { "name": "name",
              "content": templateData.user.name},
            { "name": "setupLink",
              "content": templateData.account.setupLink},
            { "name": "alreadyApplied",
              "content": templateData.account.alreadyApplied}
          ]
        }
      ],
      "google_analytics_domains": ["nuisepic.com"],

    },
    "async": true,
    "ip_pool": "default"},
    function(resp) {
      console.log(resp);
      if(typeof(success) == 'function') success(resp);
    },
    function(error) {
      console.err('confimation-mailer', error);
      if(typeof(failure) == 'function') failure(error);
  });
};

