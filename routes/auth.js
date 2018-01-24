// passport auth
var setupPassport = require('../controllers/auth/passport');
var auth = require('../controllers/auth/auth');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

module.exports = function(api) {
  api.use(flash());
  setupPassport(passport); // pass passport for configuration
  api.use(session({
    secret: 'this is a secret!',
    resave: true,
    saveUninitialized: true,
    // rolling: true,
    // saveUninitialized: false,
    // cookie: {
    // maxAge: 60000,
    // }, // time im ms
  })); // session secret
  api.use(passport.initialize());
  api.use(passport.session()); // persistent login sessions

  api.get('/', auth.isNotLoggedIn, auth.getLogin);
  api.get('/login', auth.isNotLoggedIn, auth.getLogin);
  // api.get('/logout',auth.getLogout);
  api.get('/forgot', auth.getForgot);
  api.get('/reset/:token', auth.getReset);

  // api.post('/login',auth.postLogin);
  api.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  api.post('/forgot', auth.postForgot);
  api.post('/reset/:token', auth.postReset);

  api.get('/dashboard', auth.isLoggedIn, function(req, res) {
    console.log("in /dashboard "+JSON.stringify(req.user));
    res.render('../views/dashboard.ejs', {
      user : req.user,
      title : "DashBoard"
    });
  });

  api.get('/profile', auth.isLoggedIn, auth.getProfile);

  api.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

};
