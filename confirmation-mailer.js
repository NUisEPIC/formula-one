var mandrill = require('mandrill-api/mandrill');

exports.sendConfirmationEmail = function(templateData, success, failure) {
  var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
  mandrill_client.messages.sendTemplate({
    "template_name": "EPIC Recruitment Application Response",
    "template_content" : {}, // there are no mc:edit fields
    "message": {
      "subject": "Thanks for apply for EPIC, " + templateData.name + "!",
      "to": [{ "email": templateData.email,
                "name": templateData.name
             }],
      "important": false,
      "track_opens": true,
      "track_clicks": true,
      "merge_language": "handlebars",
      "global_merge_vars": [],
      "merge_vars": [
        {
          "rcpt": templateData.email,
          "vars": [
            { "name": "name",
              "content": templateData.name},
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

exports.sendStartupEmail = function(templateData, success, failure) {
  var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
  mandrill_client.messages.sendTemplate({
    "template_name": "SCF Startup Email",
    "template_content" : {}, // there are no mc:edit fields
    "message": {
      "subject": "Welcome to the Startup Career Fair Talent Portal, " + templateData.startup.name + "!",
      "to": [{ "email": templateData.startup.email,
                "name": templateData.startup.name
             }],
      "important": false,
      "track_opens": true,
      "track_clicks": true,
      "merge_language": "handlebars",
      "global_merge_vars": [],
      "merge_vars": [
        {
          "rcpt": templateData.startup.email,
          "vars": [
            {"name": "registrationLink",
             "content": templateData.startup.registrationLink},
            {"name": "name",
             "content": templateData.startup.name}
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
}

