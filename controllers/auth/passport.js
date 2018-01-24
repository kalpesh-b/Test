var usersql = require('../../utils/usersql.js');
var connection = require('../../config/dbcpool');

var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.user_id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    usersql.findUserById(id, function(err, rows) {
      done(err, rows[0] ? rows[0] : false);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
        if (err)
        return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          // if there is no user with that username
          // create the user
          var newUserMysql = {
            username: username,
            password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
          };

          var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

          connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function(err, rows) {
            newUserMysql.id = rows.insertId;

            return done(null, newUserMysql);
          });
        }
      });
    })
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
      //console.log("passport start:req.body - useranme -password ", req.body, username, password);
      usersql.findUserByEmail(username, function(err, rows) {
        if (err) {
          console.log("error in finduser by email");
          return done(err);
        }

        if (!rows.length) {
          console.log("no user found");

          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        }

        // if the user is found but the password is wrong
        if (!bcrypt.compareSync(password, rows[0].user_password)) {
          console.log("password", password, rows.user_password);
          console.log("password didnt match!");
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        }

        console.log("login successful");

        // all is well, return successful user
        return done(null, rows[0]);
      });
    })
  );
};
