//jshint esversion:6
var pool = require('../config/dbcpool');
var append = require('./pickData').append;
var mysql = require('mysql');
var async = require('async');

var officer = {
  table: 'tt_user_mstr',
  fields: [
    'user_id',
    'first_name',
    'middle_name',
    'last_name',
    'email'
  ],
};

function getFieldOfficers(user, cb) {
  var user_id = user.user_id;
  if (user.role_id == 3) {
    return cb(null, [user]);
  }
  var join = '';
  if (user.role_id == 2) {
    join = `JOIN gcp_supervvisor_mapping gsm USING(gcp_id)
    WHERE gsm.user_id=?`;
  }
  var sql = `SELECT DISTINCT ttu.user_id
  FROM tt_user_mstr ttu
  JOIN gcp_inspector_mapping gim USING(user_id) ` +
  join + `;`;

  pool.query(sql, [user_id], function(error, results) {
    var arr = [];
    for (var id in results) {
      arr.push(results[id][`user_id`]);
    }
    cb(error, arr);
  });
}

exports.getFieldOfficers = getFieldOfficers;
