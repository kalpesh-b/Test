var gcpsql = require('../utils/gcpsql')
var ttsql = require('../utils/ttsql');
var async = require('async');
var views = require('../config/views');
var response = require('../utils/response');

function getGcps(req, res, next) {
  var user = req.user;
  gcpsql.getGcps(user, function(err, results) {
    next();
  });
}

function getPpms(req, res, next) {
  ttsql.getPpms(function(err, results) {
    res.json(results);
    next();
  });
}

function getSnms(req, res, next) {
  ttsql.getSnms(function(err, results) {
    res.json(results);
    next();
  });
}

function getCrops(req, res, next) {
  ttsql.getCrops(function(err, results) {
    res.json(results);
    next();
  });
}

function getEnrollOptions(req, res, next) {
  async.parallel({
    gcp: function(cb) {
      var user = req.user;
      gcpsql.getGcps(user, cb);
    },
    ppm: function(cb) {
      ttsql.getPpms(cb);
    },
    snm: function(cb) {
      ttsql.getSnms(cb);
    },
    crops: function(cb) {
      ttsql.getCrops(cb);
    }
  }, function formatResult(err, results) {
    var options = {};
    var gcps = {
      "gcps": results.gcp
    };
    var ppms = {
      "ppms": results.ppm
    };
    var snms = {
      "snms": results.snm
    };
    var crops = {
      "crops": results.crops
    };
    Object.assign(options, gcps, ppms, snms, crops);
    //res.json(options);
    var options = {
      view: views.ENROLL,
      data: {
        ttdata: options,
        sessionID: req.sessionID,
        user: req.user,
        message: req.flash('Farmer Enrolled successfully'),
        title: 'Farmer Enrollment'
      }
    };
    response(options, req, res);
  })
}

exports.getGcps = getGcps;
exports.getPpms = getPpms;
exports.getSnms = getSnms;
exports.getCrops = getCrops;
exports.getEnrollOptions = getEnrollOptions;
