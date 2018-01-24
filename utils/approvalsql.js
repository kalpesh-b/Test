//jshint esversion:6
var dbcpool = require('../config/dbcpool');
var userlist = require('./userlist');
var enrolFields = require('../models/enrolFields');
var enrolsql = require('../utils/enrolsql');
var specificsql = require('../utils/specificsql');
var async = require('async');

function getSubmittedFarmers(officer_id_list, done) {
  var sqlQuery = `SELECT distinct FM.farmer_id, s.status_name
  FROM farmer_mstr FM
  JOIN field_mstr FLM using(farmer_id)
  JOIN status s on s.status_id = FM.status_id
  WHERE FM.status_id = 1 AND FLM.officer_id in (?);`;

  dbcpool.query(sqlQuery, [officer_id_list],
    function(err, result) {
      if (err) throw err;
      done(err, result);
    });
  }

  function getSubmittedEnrollementDetails(farmer_id, done) {

    async.parallel({
      farmer: function(cb) {
        var pk = enrolFields.farmer.pk;
        var where = {};
        where[pk] = farmer_id;
        enrolsql.getFarmer(where, cb);
      },
      fields: function(cb) {
        var fk = enrolFields.fields.fields.field.fk;
        var where = {};
        specificsql.getFieldAndOtherMappingDetails(farmer_id, cb);
      }
    }, function formatResult(err, results) {
      var enrolData = {};
      var fields = {
        "fields": results.fields
      };
      Object.assign(enrolData, results.farmer[0], fields);

      done(err, enrolData);
    })
  }

  exports.getSubmittedFarmers = getSubmittedFarmers;
  exports.getSubmittedEnrollementDetails = getSubmittedEnrollementDetails;
