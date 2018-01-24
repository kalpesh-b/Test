// jshint esversion: 6
var mysql = require('mysql');
var dbcpool = require('../config/dbcpool');
var dataUtil = require('./pickData');

exports.insert = function(table, row, cb) {
  // body...
  console.log(table, ':', row);
  var query = dbcpool.query('INSERT INTO ?? SET ?', [table, row], function(error, results, fields) {
    // var query = dbcpool.query('INSERT INTO tt_user_mstr SET ?',user , function (error, results, fields) {
    if (error) throw error;
    console.log(table, '- results :', results);
    cb(error, results);

  });
};
exports.bulkInsert = function(dataFields, rows, cb) {
  // body...
  var valueRows = dataUtil.getValuesArray(dataFields.fields, rows);
  var query = dbcpool.query('INSERT INTO ?? (??) VALUES ?', [dataFields.table, dataFields.fields, valueRows], function(error, results, fields) {
    console.log(dataFields.table, ':', dataFields.fields, ':', valueRows);
    // var query = dbcpool.query('INSERT INTO tt_user_mstr SET ?',user , function (error, results, fields) {
    if (error) throw error;
    console.log(dataFields.table, '- results :', results);
    cb(error, results);

  });
};

exports.bulkInsertOrUpdate = function(dataFields, rows, cb) {
  // body...
  console.log("dataFileds inside bulkinsert or update :", dataFields);
  var valueRows = dataUtil.getValuesArray(dataFields.fields, rows);
  var otherFields = dataFields.fields.filter(x => x != dataFields.pk);
  var updateStr = otherFields.reduce((str, col) =>
  (str + ',' + mysql.escapeId(col) + '=VALUES(' + mysql.escapeId(col) + ')'),
  '').replace(',', '');
  console.log("dataFields.table, dataFields.fields, valueRows", dataFields.table, dataFields.fields, valueRows);
  // console.log(table, ':', fields, ':', , ':', valueRows);
  var query = dbcpool.query('INSERT INTO ?? (??) VALUES ? ON DUPLICATE KEY UPDATE ' + updateStr, [dataFields.table, dataFields.fields, valueRows], function(error, results, fields) {
    // var query = dbcpool.query('INSERT INTO tt_user_mstr SET ?',user , function (error, results, fields) {
    if (error) throw error;
    console.log(dataFields.table, '- results :', results);
    cb(error, results);

  });
};
exports.update = function(dataFields, row, cb) {
  // body...
  var where = {};
  where[dataFields.pk] = row[dataFields.pk];
  var query = dbcpool.query('UPDATE ?? SET ? WHERE ?', [dataFields.table, row, where], function(error, results, fields) {
    if (error) throw error;
    console.log(dataFields.table, ':results:', results);
    cb(error, results);

  });
};

exports.find = function(table, row, cb) {
  // body...
  var query = dbcpool.query('SELECT * FROM ?? WHERE ?', [table, row], function(error, results, fields) {
    if (error) throw error;

    // console.log("fields: ", fields);
    console.log("results-find: ", results);
    // console.log("results length: ", results.length);
    // console.log("results length: ", results[0].email);

    cb(error, results);
  });
};
exports.fetch = function(table, where, cb) {
  // body...
  var query = dbcpool.query('SELECT * FROM ?? WHERE ?', [table, where], function(error, results, fields) {
    if (error) throw error;

    // console.log("fields: ", fields);
    console.log("results-where: ", results);
    // console.log("results length: ", results.length);
    // console.log("results length: ", results[0].email);
    // results = JSON.parse(JSON.stringify(results));
    cb(error, results);
  });
};
exports.fetchAll = function(table, cb) {
  // body...
  dbcpool.query('SELECT * FROM ??', table, function(err, results) {
    cb(err, results);
  });
};
exports.findOne = function(table, row, cb) {
  // body...
  var query = dbcpool.query('SELECT * FROM ?? WHERE ? LIMIT 1', [table, row], function(error, result, fields) {
    if (error) throw error;

    // console.log("fields: ", fields);
    console.log("results: ", result);
    // console.log("results length: ", results.length);
    // console.log("results length: ", results[0].email);

    cb(error, result);
  });
};
exports.insertOrUpdate = function(table, row, ukey, cb) {
  // body...
  var row_copy = Object.assign({}, row);
  delete row_copy[ukey];
  var query = dbcpool.query('INSERT INTO ?? SET ? ON DUPLICATE KEY UPDATE  ?', [table, row, row_copy], function(error, results, fields) {
    if (error) throw error;

    console.log("results: ", results);

    cb(error, results);
  });
};


exports.delete = function(table, row, cb) {
  var query = dbcpool.query('DELETE FROM ??  WHERE ?', [table, row], function(error, results, fields) {
    if (error) throw error;

    console.log("results: ", results);

    cb(error, results);
  });
}

exports.deactivateRecord = function(dataFields, id, cb) {
  // body...
  var where = {
    [dataFields.pk]: id
  };
  var set = {
    status_id: 3
  };
  var query = dbcpool.query('UPDATE ?? SET ? WHERE ?', [dataFields.table, set, where]);
};


// TESTING
//
var table = 'tt_user_mstr',
row = {
  // user_id:21,
  first_name: "navn",
  middle_name: "devihalli",
  last_name: "nanjunadaswamy",
  // resetPasswordToken:'updatedtoken2',
  // resetPasswordExpires:new Date(Date.now()+3600000)

  // email:"asdfg@gmaill.com"
},
where = {
  user_id: 1
};
