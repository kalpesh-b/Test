//jshint esversion:6
var pool = require('../config/dbcpool');
var append = require('./pickData').append;
// var mysql = require('mysql');
var gcpMstr = {
  table: 'gcp_mstr',
  fields: [
    'gcp_id',
    'gcp_name',
    'gcp_city',
    'gcp_area',
    'gcp_supervisor_secretary',
    'gcp_admin_president',
    'gcp_state',
  ]
};

function getGcps(user, cb) {
  var join = `JOIN gcp_inspector_mapping gim USING(gcp_id)
  WHERE gim.user_id = ?`;

  if (user.role_id == 2) {
    join = `JOIN gcp_supervvisor_mapping gsm USING(gcp_id)
    WHERE gsm.user_id=?`;
  } else if (user.role_id == 1) {
    join = ``;
  }
  var sql = `
  SELECT DISTINCT ` +
  append('gms', gcpMstr.fields) + `
  FROM gcp_mstr gms ` +
  join;
  // console.log(mysql.format(sql, [user.user_id]));
  pool.query(sql, [user.user_id], function(err, results) {
    // console.log('result:', results);
    cb(err, results);
  });
}
exports.getGcps = getGcps;
