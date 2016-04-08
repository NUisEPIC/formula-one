var _ = require('underscore');

module.exports = (function() {

  var emails =
     "annekauth@fullbridge.com \
      Matt@weevu.com \
      jmiller@elementbars.com \
      dalia@scoutalarm.com \
      danielle@heirlume.com \
      bailey@simplerelevance.com \
      tian@homechef.com \
      lindsay.dagiantis@riseinteractive.com \
      lindsay.dagiantis@riseinteractive.com \
      yuanxinbi225@gmail.com \
      kyle.hudson@viatechnik.com \
      mike@meliorak.com \
      stefan.birrer@phenixp2p.com \
      tderrick@openmarketshealth.com \
      valerie@edovo.com \
      mike@rentlikeachampion.com \
      moses@humanpractice.com \
      jgordon@sms-assist.com \
      ajelesnianska@civisanalytics.com \
      eabernathey@procuredhealth.com \
      pamela@synd.io \
      odekirk@curiosity.com \
      molly@sproutsocial.com \
      morgan@areyouahuman.com \
      kate@bucketfeet.com \
      laila@ventureforamerica.org \
      acarpenter@narrativescience.com \
      emily.geitner@linkcapital.com \
      EricBrownrout2016@u.northwestern.edu \
      mjogren@graham-allen.com \
      marissa@mychildnow.com \
      britt@hooraypuree.com \
      topel@tangiblehaptics.com \
      mkritzman@skillnet.net \
      bryan@abundantventurepartners.com \
      pgandhi@inspirotec.com \
      brian@thinkcerca.com \
      Hans@luxe.com \
      haibo@canceriq.com \
      barbara@healthbox.com \
      jason.pawlak@avantcredit.com \
      mike@trunkclub.com \
      lamia@gopangea.com \
      jami.melbourne@performics.com \
      tim.bearman@nisa.com  \
      Brian@jellyvision.com \
      justin.thompson@powerreviews.com \
      sharonh235493@yahoo.com \
      mkazimi@nanoal.com \
      sharon@gsrenergylimited.net \
      jackson@learnmetrics.com \
      manoraghava.p@mu-sigma.com \
      eric@opternative.com \
      natalie@nwcookin.com \
      emily@sagecorps.com \
skorlir@gmail.com".split(' ').filter(function(s) { return s !== '' });

  var companyNames =
     "Fullbridge\n\
      WeevU\n\
      Element Bars\n\
      Scout Alarm\n\
      Heirlume\n\
      Simple Relevance\n\
      Home Chef\n\
      Rise Interactive\n\
      Rise Interactive\n\
      Beyondmenu.com\n\
      VIATechnik\n\
      Meliora K.\n\
      PhenixP2P\n\
      OpenMarkets\n\
      Jail Education Solutions\n\
      Rent Like a Champion\n\
      Human Practice\n\
      SMS Assist\n\
      Civis Analytics\n\
      Procured Health\n\
      Syndio\n\
      Curiosity\n\
      Sprout Social\n\
      Are You a Human\n\
      BucketFeet\n\
      Venture for America\n\
      Narrative Science\n\
      Link Capital\n\
      Pvmnt\n\
      Aunalytics\n\
      MyChild Inc.\n\
      Hooray Puree, Inc\n\
      Tangible Haptics\n\
      SkillNet\n\
      Abundant Venture Partners / AVIA Health Innovation\n\
      Inspirotec\n\
      ThinkCERCA\n\
      Luxe Valet\n\
      CancerIQ\n\
      Healthbox\n\
      AvantCredit\n\
      Trunk Club\n\
      Pangea\n\
      Performics\n\
      NISA, Investment Advisors, L.L.C.\n\
      Jellyvision\n\
      PowerReviews\n\
      GSR Energy\n\
      NanoAl LLC\n\
      GSR Energy Limited\n\
      Learnmetrics\n\
      Mu Sigma Inc\n\
      Opternative\n\
      Now We're Cookin'\n\
      Sage Corps\n\
I Am a Fake Startup".split('\n').map(function(s,i,a) { return s.trim() });

  var startupList = _.zip(emails, companyNames);

  console.log(startupList);

  return startupList;
})();
