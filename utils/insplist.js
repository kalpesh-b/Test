//jshint esversion:6
const pool = require('../config/dbcpool');
var append = require('./pickData').append;
var insp = {
  table: 'field_inspection',
  fields: [
    'field_insp_id',
    'begin_date_conversation',
    'last_date_conversation',
    'status_id',
    'fld_offcr_id',
    'field_id',
    'created_date',
    'created_by',
    'last_updated_by',
    'last_updated_date'
  ],
};

var officer = {
  table: 'tt_user_mstr',
  fields: [
    'user_id',
    'first_name',
    'middle_name',
    'last_name',
    'email',
    'status_id',
  ],
};

var field = {
  table: 'field_mstr',
  fields: ['farmer_id'],
};

var farmer = {
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
    'district',
    'state',
    'country',
    'pincode',
  ]
};

var gm = {
  table: 'gcp_mapping',
  fields: [
    'gcp_id',

  ]
};

var gcpMstr = {
  table: 'gcp_mstr',
  fields: [
    'gcp_name'
  ]
};

function getInspectionList(fieldOfficers, cb) {

  var sql = `
  SELECT ` +
  append('insp', insp.fields) + `,` +
  append('ttu', officer.fields) + `,` +
  field.fields + `,` +
  append('frm', farmer.fields, true) +
  `,` + gm.fields +
  `,` + gcpMstr.fields +
  `
  FROM field_inspection insp
  JOIN tt_user_mstr ttu ON insp.fld_offcr_id=ttu.user_id
  JOIN field_mstr USING(field_id)
  JOIN farmer_mstr frm USING(farmer_id)
  JOIN gcp_mapping gm USING(field_id)
  JOIN gcp_mstr gms USING(gcp_id)
  ` +
  (fieldOfficers && fieldOfficers.length ?
    `WHERE fld_offcr_id IN (?)` :
    ``);
    pool.query(sql, [fieldOfficers], function(err, r) {
      console.log("result:", JSON.stringify(r, null, 2));
      cb(err, r);
    });

  }

  function getFieldOfficers(user, cb) {

    if (user.role_id == 3) {
      return cb(null, [user]);
    }
    var join = '';
    if (user.role_id == 2) {
      join = `JOIN gcp_supervvisor_mapping gsm USING(gcp_id)
      WHERE gsm.user_id=?`;
    }
    var sql = `SELECT DISTINCT ` +
    append('ttu', officer.fields) +
    ` FROM tt_user_mstr ttu
    JOIN gcp_inspector_mapping gim USING(user_id) ` +
    join;
    pool.query(sql, [user.user_id], cb);
  }
  exports.getInspectionList = getInspectionList;
  exports.getFieldOfficers = getFieldOfficers;
