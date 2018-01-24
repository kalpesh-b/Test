//jshint esversion:6
var pool = require('../config/dbcpool');
var append = require('./pickData').append;
var mysql = require('mysql');
var farmerMstr = {
  table: 'farmer_mstr',
  fields: [
    'farmer_id',
    'frm_name',
    'frm_husbnd_name',
    'last_name',
    'addr1',
    'addr2',
    'addr3',
    'city_twn_village',
    'state',
    'pincode',
    'mobile',
    'landline',
    'district',
    'status_id',
    'file_path',
    // 'country',
    // 'email',
    // 'created_date',
    // 'Created_by',
    // 'last_updated_by',
    // 'last_updated_date',
  ]
};

function getFarmersfor(user, cb) {
  var join = `JOIN gcp_inspector_mapping gim USING(gcp_id)
  WHERE gim.user_id=?`;

  if (user.role_id == 2) {
    join = `JOIN gcp_supervvisor_mapping gsm USING(gcp_id)
    WHERE gsm.user_id=?`;
  } else if (user.role_id == 1) {
    join = ``;
  }
  // TODO: how to join farmer mstr to supervisor/inspector
  // 1. farmerMstr-fieldMstr-gcpMapping-gcpSpvsrMapping/gcpInspMapping
  // 2. farmerMstr-fieldMstr-/gcpMapping-gcpSpvsrMapping
  // method : 1
  var sql = `
  SELECT DISTINCT ` +
  append('frm', farmerMstr.fields) + `
  FROM farmer_mstr frm
  JOIN field_mstr fld USING(farmer_id)
  JOIN gcp_mapping gcpm USING(field_id) ` +
  join;
  // console.log(mysql.format(sql, [user.user_id]));
  pool.query(sql, [user.user_id], function(err, results) {
    // console.log('result:', results);
    cb(err, results);
  });
}

exports.getFarmersfor = getFarmersfor;
