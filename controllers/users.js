var dbcpool = require('../config/dbcpool');
var db = require('../utils/mysqldb');
var usersql = require('../utils/usersql');
var userFields = require('../models/userFields');
var dataUtil = require('../utils/pickData');
var async = require('async');
var views = require('../config/views');
var response = require('../utils/response');
var gcpsql = require('../utils/gcpsql');
exports.isAdminEmpty = function(req, res, next) {
  // body...
  usersql.countAdmins(function(err, n) {
    if (n) {
      return res.redirect('/login');
    }
    req.flash('adduserMessage', 'Please add the first admin . role will be defaulted to admin.');
    next();
    // res.render('adduser',)
  });
};

exports.getAdd = function(req, res, next) {
  // body...
  async.parallel({
    gcps: function(cb) {
      gcpsql.getGcps(req.user, cb);
    },
    roles: function(cb) {

      usersql.getUserRoles(cb);
    },
  }, function(err, results) {
    var options = {
      view: views.USER_ADD,
      data: {
        ttdata: results,
        sessionID: req.sessionID,
        user: req.user,
        message: req.flash('adduserMessage'),
        title: 'Add User'
      }
    };
    response(options, req, res);
    // res.render('adduser', {
    //   ttdata: data,
    //   message: req.flash('adduserMessage')
    // });
  });
  // async.waterfall()

};


exports.getList = function(req, res, next) {
  // body...
  var data = {};
  usersql.getActiveUsers(function(err, userList) {
    data.users = userList;
    // console.log('userList:', userList);
    // console.log('userList json:', JSON.parse(JSON.stringify(userList)));
    var options = {
      view: views.USER_LIST,
      data: {
        ttdata: data,
        sessionID: req.sessionID,
        user: req.user,
        title:'User List',
        message: req.flash('listUserMessage')
      }
    };
    response(options, req, res);
    // res.render('listusers', {
    //   ttdata: data
    // });
  });
};
exports.getSearchList = function(req, res, next) {
  // body...
  var data = {};
  usersql.searchActiveUsers(req.query, function(err, userList) {
    data.usersFound = userList;
    // console.log('userList:', userList);
    // console.log('userList json:', JSON.parse(JSON.stringify(userList)));
    var options = {
      view: views.USER_LIST,
      data: {
        ttdata: data,
        user: req.user,
        title:'User List'
      }
    };
    response(options, req, res);
    // res.render('listusers', {
    //   ttdata: data
    // });
  });
};
exports.getUser = function(req, res, next) {
  // body...
  var data = {};
  // console.log("req.query.id:",req.query.id);
  usersql.getUserDetails(req.query.id, function(err, user) {
    data.user = user;
    console.log("user data:", JSON.stringify(data, null, 2));
    var options = {
      view: views.USER_VIEW,
      data: {
        ttdata: data,
        sessionID: req.sessionID,
        user: req.user,
        title: 'User Details'
      }
    };
    response(options, req, res);
    // res.render('viewUser', {
    //   ttdata: data
    // });
  });
};
exports.getUpdate = function(req, res, next) {
  // body...
  async.parallel({
    gcps: function(cb) {
      gcpsql.getGcps(req.user, cb);
    },
    roles: function(cb) {
      usersql.getUserRoles(cb);
    },
    user: function(cb) {
      usersql.getUserDetails(req.query.id, cb);
    },
  }, function(err, results) {
    var options = {
      view: views.USER_UPDATE,
      data: {
        ttdata: results,
        sessionID: req.sessionID,
        user: req.user,
        message: req.flash('updateUserMessage'),
        title: 'User Update'
      }
    };
    response(options, req, res);
    // res.render('updateUser', {
    //   ttdata: data
    // });
  });
};
exports.postAdd = function(req, res, next) {
  // body...
  // console.log('req: ', req);
  // console.log('req.body: ', req.body);
  // req.user = {};
  var userData = dataUtil.pickData(req.body, userFields);
  if (req.user) {
    userData.ttUserMstr.created_by = req.user.user_id;
    userData.ttUserMstr.last_updated_by = req.user.user_id;
  }
  if (req.files && req.files.picture) {
    userData.ttUserMstr.file_path = req.files.picture[0].filename;
  }
  userData.ttUserMstr.status_id = 2;


  async.waterfall([
    function(cb) {
      usersql.findUserByEmail(userData.ttUserMstr.email, function(err, rows) {
        if (err)
        cb(err);
        if (rows.length) {
          cb(req.flash('adduserMessage', 'That email has already been registered!'));
        } else {
          cb(null);
        }

      });

    },
    function(cb) {
      db.insert('tt_user_mstr', userData.ttUserMstr, cb);
    },
    function(results, cb) {
      userData.rolesTransaction.user_id = results.insertId;
      if (!req.user) {
        userData.rolesTransaction.role_id = 1;
        // userData.rolesTransaction.created_by = req.user.user_id;
        // userData.rolesTransaction.last_updated_by = req.user.user_id;
      }
      userData.rolesTransaction.role_id = userData.rolesTransaction.role_id || 3;
      db.insert('roles_transaction', userData.rolesTransaction, cb);
    }
  ], function(err, results) {
    if (err) {
      return res.redirect(req.path);
    }
    next();
  });
};
exports.postUpdate = function(req, res, next) {
  // body...
  // console.log("request user : ",req.user);
  // console.log("request session : ",req.session);
  var userData = dataUtil.pickData(req.body, userFields);
  if (req.user) {
    // userData.ttUserMstr.created_by = req.user.user_id;
    userData.ttUserMstr.last_updated_by = req.user.user_id;
  }
  if (req.files && req.files.picture) {
    userData.ttUserMstr.file_path = req.files.picture[0].filename;
  }
  userData.ttUserMstr.status_id = 2;

  // console.log('req.body from rest : ', req.body);
  // var user = extractUser(req);
  async.parallel([
    function(cb) {
      // update ttUserMstr
      console.log("ttuserdata:", userData.ttUserMstr);
      usersql.updateUser(userData.ttUserMstr, cb);
    },
    function(cb) {
      // update rolesTransaction
      console.log('userData.rolesTransaction:', userData.rolesTransaction);
      userData.rolesTransaction.role_id = userData.rolesTransaction.role_id || 3;
      usersql.updateUserRole(userData.rolesTransaction, cb);
      //cb(req.flash('updateuserMessage', 'updated succesfully'));
    },
  ], function(err, results) {
    // next();
    if (!err) {
      req.flash('updateUserMessage', 'User details updated successfully!');
    } else {
      req.flash('updateUserMessage', 'Failed to update User details');
    }
    return res.redirect(req.originalUrl);

  });

};
exports.postDelete = function(req, res, next) {
  // body...
  // req.user = {};
  var ttUserMstrData = {
    user_id: req.query.id,
    status_id: 3,
    last_updated_by: req.query.id
  };
  console.log("user to be deactivated :", ttUserMstrData);
  usersql.updateUser(ttUserMstrData, function(err, results) {
    console.log('result after user deleet:', results);
    if (!err) {
      req.flash('listUserMessage', 'Successfully deactivated user');
    } else {
      req.flash('listUserMessage', 'User deactivation failed');
    }
    return response({
      redirect: '/user/list',
      context: true
    }, req, res);

  });
};
