function response(options, req, res, next) {
  if (options.redirect) {
    var context = (options.context && req.query.j) ?
    (((options.redirect.includes('?')) ? '&' : '?') + 'j=' + req.query.j) : '';
    console.log('redirect path:', options.redirect + context);
    return res.redirect(options.redirect + context);
  }
  if (req.user) {
    options.data.sessionID = req.sessionID;
    options.data.user = req.user;
  }
  if (req.query.j) {
    return res.json(options.data);
  }
  return res.render(options.view, options.data);
}

module.exports = response;
