// jshint esversion:6
var gcpsql = require('../utils/gcpsql');
var enrolsql = require('../utils/enrolsql');
var ttsql = require('../utils/ttsql');
var specificsql = require('../utils/specificsql');
var userlist = require('../utils/userlist');
var views = require('../config/views');
var response = require('../utils/response');

var enrolFields = require('../models/enrolFields');
var dataUtil = require('../utils/pickData');
var async = require('async');

exports.getNewFarmerEnrollment = function(req, res, next) {
  collectSuggestions(req, function(err, result) {
    var data = {};

    var options = {
      view: views.ENROLL_NEW,
      data: {
        ttdata: result,
        sessionID: req.sessionID,
        user: req.user,
        message: req.flash('newEnrollMessage'),
        title: 'Farmer Enrollment'
      }
    };
    response(options, req, res);
    // res.render('adduser', {
    //   ttdata: data,
    //   message: req.flash('adduserMessage')
    // });
    //  });
  });
  // async.waterfall()

};

function postNewFarmerEnrollment(req, res, next) {
  var enrolData = dataUtil.pickData(req.body, enrolFields);
  console.log('enroll data : '+JSON.stringify(enrolFields));
  enrolData.farmer.created_by = req.user.user_id;
  enrolData.farmer.last_updated_by = req.user.user_id;
  if (req.files) {
    enrolData.farmer.file_path = req.files.picture[0].filename;
  }
  enrolData.farmer.status_id = 1; //TODO discuss this more

  async.waterfall([
    function(cb) {
      enrolsql.addFarmer(enrolData.farmer, cb);
    },
    function(results, cb) {
      var farmerId = results.insertId;
      //  console.log('enroll data : '+JSON.stringify(enrolData.fields));
      var addFieldFunctionArray = enrolData.fields.map(
        field => function(cb) {

          var user_id = req.user.user_id;
          addNewField(farmerId, user_id, field, cb);
        });
        async.parallel(addFieldFunctionArray, function(err, results) {
          cb();
        });
      }
    ], function(err, results) {
      if (!err) {
        req.flash('newEnrollMessage', 'Successfully created enrollment');
      } else {
        req.flash('newEnrollMessage', 'Enrollment creation failed');
      }
      return res.redirect(req.originalUrl);
      //  res.send("success");
    });
  }

  function addNewField(farmerId, user_id, fieldData, cb) {
    async.waterfall([
      function(cb) {

        fieldData.field.farmer_id = farmerId;
        fieldData.field.officer_id = user_id;
        fieldData.field.status_id = 1;
        enrolsql.addField(fieldData.field, cb);
      },
      function(results, cb) {

        var fieldId = results.insertId;
        fieldData.ppm.field_id = fieldId;
        fieldData.snm.field_id = fieldId;
        fieldData.gcp.field_id = fieldId;

        dataUtil.addForEach(fieldData.crops, 'field_id', fieldId);

        async.parallel([
          function(cb) {
            enrolsql.addGcpMapping(fieldData.gcp, cb);
          },
          function(cb) {
            enrolsql.addSnmMappping(fieldData.snm, cb);
          },
          function(cb) {
            enrolsql.addPpmMapping(fieldData.ppm, cb);
          },
          function(cb) {
            enrolsql.addCropsMapping(fieldData.crops, cb);
          }
        ], function(err, results) {
          cb();
        });
      }
    ], function(err, results) {
      cb();
    });
  }

  function getEnrolledFarmerDetails(req, res, next) {

    async.parallel({
      farmer: function(cb) {
        var pk = enrolFields.farmer.pk;
        var where = {};
        where[pk] = req.params.id;
        enrolsql.getFarmer(where, cb);
      },
      fields: function(cb) {
        var fk = enrolFields.fields.fields.field.fk;
        var where = {};
        specificsql.getFieldAndOtherMappingDetails(req.params.id, cb);
      },
      suggestions: function(cb) {
        collectSuggestions(req, cb);
      }
    }, function formatResult(err, results) {
      var enrolData = {};
      var fields = {
        "fields": results.fields
      };
      var suggestions = {
        "suggestions": results.suggestions
      };
      Object.assign(enrolData, results.farmer[0], fields, suggestions);
      var options = {
        view: views.ENROLL_VIEW,
        data: {
          ttdata: enrolData,
          sessionID: req.sessionID,
          user: req.user,
          title: 'Farmer Details'
          //  title: 'Farmer Details'
        }
      };
      response(options, req, res);
    });
  }

  function getEnrolledFieldDetails(req, res, next) {

    async.parallel({
      farmer: function(cb) {
        var pk = enrolFields.farmer.pk;
        var where = {};
        where[pk] = req.params.id;
        enrolsql.getFarmer(where, cb);
      },
      fields: function(cb) {
        var fk = enrolFields.fields.fields.field.fk;
        var where = {};
        specificsql.getFieldAndOtherMappingDetails(req.params.id, cb);
      }
    }, function formatResult(err, results) {
      var enrolData = {};
      var fields = {
        "fields": results.fields
      };
      Object.assign(enrolData, results.farmer[0], fields);
      //  res.json(enrolData);
      var options = {
        view: views.ACTION_FIELDS,
        data: {
          ttdata: enrolData,
          sessionID: req.sessionID,
          user: req.user,
          title: 'Field Action'
        }
      };
      response(options, req, res);
    })
  }

  function getEnrolledFarmerUpdate(req, res, next) {

    async.parallel({
      farmer: function(cb) {
        var pk = enrolFields.farmer.pk;
        var where = {};
        where[pk] = req.params.id;
        enrolsql.getFarmer(where, cb);
      },
      fields: function(cb) {
        var fk = enrolFields.fields.fields.field.fk;
        var where = {};
        specificsql.getFieldAndOtherMappingDetails(req.params.id, cb);
      }
    }, function formatResult(err, results) {
      var enrolData = {};
      var fields = {
        "fields": results.fields
      };
      Object.assign(enrolData, results.farmer[0], fields);
      //  res.json(enrolData);

      var options = {
        view: views.ENROLL_UPDATE,
        data: {
          ttdata: enrolData,
          sessionID: req.sessionID,
          user: req.user,
          message: req.flash('updateEnrollMessage'),
          title: 'Farmer Update'
        }
      };
      response(options, req, res);
      //res.json("Success");
    })
  }

  function getAllEnrollmentsHighlights(req, res, next) {
    userlist.getFieldOfficers(req.user, function(err, users) {
      specificsql.getAllEnrollmentHighlight(users, function(err, results) {

        var options = {
          view: views.ENROLL_LIST,
          data: {
            ttdata: results,
            sessionID: req.sessionID,
            user: req.user,
            title:'Enrollment List'
          }
        };
        response(options, req, res);
        //  res.json(results);
        next();
      });
    });
  }

  function getSearchEnrolledFarmers(req, res, next) {
    userlist.getFieldOfficers(req.user, function(err, users) {
      var query = req.params.query;
      specificsql.getSearchEnrolledFarmers(users, query, function(err, results) {
        var options = {
          view: views.ENROLL_SEARCH,
          data: {
            ttdata: results
          }
        };
        response(options, req, res);
        next();
      });
    });
  }

  function postUpdateFarmerEnrollment(req, res, next) {

    var enrolData = dataUtil.pickData(req.body, enrolFields);
    enrolData.farmer.last_updated_by = req.user.user_id;

    async.parallel([
      function(cb) {
        enrolsql.updateFarmer(enrolData.farmer, cb);
      },
      function(cb) {

        var updateFieldFunctionArray = enrolData.fields.map(
          field => function(cb) {

            updateField(field, cb);
          });
          async.parallel(updateFieldFunctionArray, function(err, results) {
            cb(err, results);
          });
        }
      ],
      function(err, results) {
        if (!err) {
          req.flash('updateEnrollMessage', 'Successfully updated enrollment');
        } else {
          req.flash('updateEnrollMessage', 'Enrollment update failed');
        }

        console.log(req.originalUrl);
        return res.redirect(req.originalUrl);
      });
    }


    function updateField(fieldData, done) {
      async.waterfall([
        function(cb) {
          enrolsql.updateField(fieldData.field, cb);
        },
        function(results, cb) {

          var fieldId = fieldData.field.field_id;
          fieldData.ppm.field_id = fieldId;
          fieldData.snm.field_id = fieldId;
          fieldData.gcp.field_id = fieldId;
          dataUtil.addForEach(fieldData.crops, 'field_id', fieldId);

          async.parallel([
            function(cb) {
              enrolsql.updateGcpMapping(fieldData.gcp, cb);
            },
            function(cb) {
              enrolsql.updateSnmMappping(fieldData.snm, cb);
            },
            function(cb) {
              enrolsql.updatePpmMapping(fieldData.ppm, cb);
            },
            function(cb) {
              enrolsql.updateCropsMapping(fieldData.crops, fieldId, cb);
            }
          ], function(err, results) {
            cb(err, results);
          });
        }
      ], function(err, results) {
        done(err, results);
      });
    }

    function postDeleteFarmerEnrollment(req, res, next) {

      var farmerData = {
        farmer_id: req.params.id,
        last_updated_by: req.user.user_id,
        status_id: 3
      };

      enrolsql.updateFarmer(farmerData, function(err, results) {
        var options = {
          view: views.ENROLL_DELETE_FARMER,
          data: {
            ttdata: results
          }
        };
        response(options, req, res);
      });
    }

    function postDeleteFieldEnrollment(req, res, next) {

      var fieldData = {
        field_id: req.params.id,
        last_updated_by: req.user.user_id,
        status_id: 3
      };

      enrolsql.updateField(fieldData, function(err, results) {
        //  res.send('successfully deactivated field');
        var options = {
          view: views.ENROLL_DELETE_FIELD,
          data: {
            ttdata: results
          }

        };
        response(options, req, res);
      });
    }

    function getUpdateFarmerEnrollment(req, res, next) {
      async.parallel({
        farmer: function(cb) {
          var pk = enrolFields.farmer.pk;
          var where = {};
          where[pk] = req.query.id;
          enrolsql.getFarmer(where, cb);
        },
        fields: function(cb) {
          var fk = enrolFields.fields.fields.field.fk;
          var where = {};
          console.log("req.params.id", req.query.id);
          specificsql.getFieldAndOtherMappingDetails(req.query.id, cb);
        },
        suggestions: function(cb) {
          collectSuggestions(req, cb);
        }
      }, function formatResult(err, results) {
        var enrolData = {};
        var fields = {
          "fields": results.fields
        };
        var suggestions = {
          "suggestions": results.suggestions
        };
        Object.assign(enrolData, results.farmer[0], fields, suggestions);
        var options = {
          view: views.ENROLL_UPDATE,
          data: {
            ttdata: enrolData,
            message: req.flash('updateEnrollMessage'),
            sessionID: req.sessionID,
            user: req.user,
            title: 'Farmer Update'
          }
        };
        response(options, req, res);
      });
    }

    function collectSuggestions(req, done) {
      async.parallel({
        gcps: function(cb) {
          gcpsql.getGcps(req.user, cb);
        },
        ppms: function(cb) {
          ttsql.getPpms(cb);
        },
        snms: function(cb) {
          ttsql.getSnms(cb);
        },
        crops: function(cb) {
          ttsql.getCrops(cb);
        },
      }, function(err, results) {
        done(err, results);
      });
    }
    exports.postNewFarmerEnrollment = postNewFarmerEnrollment;
    exports.postDeleteFarmerEnrollment = postDeleteFarmerEnrollment;
    exports.postDeleteFieldEnrollment = postDeleteFieldEnrollment;
    exports.getEnrolledFarmerDetails = getEnrolledFarmerDetails;
    exports.getEnrolledFarmerUpdate = getEnrolledFarmerUpdate;
    exports.postUpdateFarmerEnrollment = postUpdateFarmerEnrollment;
    exports.getEnrolledFieldDetails = getEnrolledFieldDetails;


    exports.getAllEnrollmentsHighlights = getAllEnrollmentsHighlights;
    exports.getSearchEnrolledFarmers = getSearchEnrolledFarmers;
    //exports.getNewFarmerEnrollment = getNewFarmerEnrollment;
    exports.getUpdateFarmerEnrollment = getUpdateFarmerEnrollment;
