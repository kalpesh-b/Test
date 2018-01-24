// jshint esversion:6
var approvalsql = require('../utils/approvalsql');
var async = require('async');
var enrolsql = require('../utils/enrolsql');
var enrolFields = require('../models/enrolFields');
var userlist = require('../utils/userlist');
var views = require('../config/views');
var response = require('../utils/response');

function getEnrollmentsForApprovals(req, res, next) {

  async.waterfall([
    function(cb) {
      userlist.getFieldOfficers(req.user, function(err, users) {
        approvalsql.getSubmittedFarmers(users, cb);
      });
    },
    function(results, cb) {
      var addFieldFunctionArray = results.map(
        farmer => function(cb) {
          var farmer_id = farmer[`farmer_id`];
          approvalsql.getSubmittedEnrollementDetails(farmer_id, function(err, result) {
            if (err) throw err;
            var status = {
              'status_name': farmer[`status_name`]
            }
            Object.assign(result, status);
            cb(err, result);
          });
        });
        async.parallel(addFieldFunctionArray, function(err, results) {
          cb(err, results);
        });
      }
    ],
    function formatResult(err, results) {
      //  res.json(results);
      var options = {
        view: views.APPROVE_LIST,
        data: {
          ttdata: results,
          sessionID: req.sessionID,
          user: req.user,
          title:'Approval List'
        }
      };
      response(options, req, res);
    });
  }

  function approveEnrollment(req, res, next) {
    var user_id = req.user.user_id;
    changeFarmerStatus(user_id, req.params.id, 4, function(err, result) {});
    var where = {};
    where[`farmer_id`] = req.params.id;
    enrolsql.getFields(where, function(error, results) {
      var addFieldFunctionArray = results.map(
        field => function(cb) {
          var field_id = field[`field_id`];
          changeFieldStatus(user_id, field_id, 4, function(err, result) {});
        });
        async.parallel(addFieldFunctionArray, function(err, results) {
          cb(err, results);
        });
      });

      res.send('successfully approved enrollment');
    }

    function rejectEnrollment(req, res, next) {
      var user_id = req.user.user_id;
      changeFarmerStatus(user_id, req.params.id, 5, function(err, result) {

      });
      var fk = enrolFields.fields.fields.field.fk;
      var where = {};
      where[fk] = req.params.id;
      enrolsql.getFields(where, function(error, results) {
        var addFieldFunctionArray = results.map(
          field => function(cb) {
            var field_id = field[`field_id`];
            changeFieldStatus(user_id, field_id, 5, function(err, result) {

            });
          });
          async.parallel(addFieldFunctionArray, function(err, results) {
            cb(err, results);
          });
        });
        res.send('successfully rejected enrollment');
      }

      function approveFarmer(req, res, next) {
        changeFarmerStatus(req.user.user_id, req.params.id, 4, function(err, results) {
          res.send('successfully approved farmer');
        });
      }

      function rejectFarmer(req, res, next) {
        changeFarmerStatus(req.user.user_id, req.params.id, 5, function(err, results) {
          res.send('successfully rejected farmer');
        });
      }

      function approveField(req, res, next) {
        changeFieldStatus(req.user.user_id, req.params.id, 4, function(err, results) {
          res.send('successfully approved field');
        });
      }

      function rejectField(req, res, next) {
        changeFieldStatus(req.user.user_id, req.params.id, 5, function(err, results) {
          res.send('successfully rejected field');
        });
      }

      function changeFarmerStatus(user_id, farmer_id, status, done) {

        var farmerData = {
          farmer_id: farmer_id,
          last_updated_by: user_id,
          status_id: status
        };

        enrolsql.updateFarmer(farmerData, done);
      }

      function changeFieldStatus(user_id, field_id, status, done) {

        var fieldData = {
          field_id: field_id,
          last_updated_by: user_id,
          status_id: status
        };

        enrolsql.updateField(fieldData, done);
      }


      exports.getEnrollmentsForApprovals = getEnrollmentsForApprovals;
      exports.approveFarmer = approveFarmer;
      exports.rejectFarmer = rejectFarmer;
      exports.approveField = approveField;
      exports.rejectField = rejectField;
      exports.approveEnrollment = approveEnrollment;
      exports.rejectEnrollment = rejectEnrollment;
