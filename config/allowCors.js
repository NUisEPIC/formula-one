var allowCors = function (domain) {
  return function(req, res, next) {
    // allow cross-origin-resource sharing from
    // any nuisepic.com domain
    res.header('Access-Control-Allow-Origin',
               'http://epic-talent-portal.herokuapp.com');
    res.header('Access-Control-Allow-Methods',
               'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
               'Content-Type, Authorization,'
               + 'Content-Length, X-Requested-With');

    // be nice to OPTIONS
    req.method == 'OPTIONS' ? res.sendStatus(200) : next();
  }
}

module.exports = allowCors;
