// jshint esversion:6

var gcpsql = require('../utils/gcpsql');
var inspsql = require('../utils/inspsql');
var usersql = require('../utils/usersql');
var insplist = require('../utils/insplist');
var farmerlist = require('../utils/farmerlist');
// var farmersql = require('../utils/farmersql');
var ttsql = require('../utils/ttsql');
var inspFields = require('../models/inspFields');
var dataUtil = require('../utils/pickData');
var response = require('../utils/response');
var views = require('../config/views');
var async = require('async');


function getICI1(req, res, next) {
  async.parallel({
    gcps: function(cb) {
      gcpsql.getGcps(req.user, cb);
    },
    inspectors: function(cb) {
      insplist.getFieldOfficers(req.user, cb);
    },
    farmers: function(cb) {
      farmerlist.getFarmersfor(req.user, cb);
    },
  }, function(err, results) {
    console.log('error', err);
    console.log('results', results);
    var options = {
      view: views.INSP_F1,
      data: {
        ttdata: results,
        sessionID: req.sessionID,
        user: req.user,
        title: 'New IC Inspection'
      }
    };
    response(options, req, res);
  });
}

function getICI2(req, res, next) {
  async.parallel({
    smis: function(cb) {
      ttsql.getSmis(cb);
    },
    equis: function(cb) {
      ttsql.getEquipments(cb);
    },
    ppms: function(cb) {
      ttsql.getPpms(cb);
    }, // is ppm same eco conservationsystem?
    // TODO add animal husbandry fetching
    crops: function(cb) {
      ttsql.getCrops(cb);
    },
  }, function(err, results) {
    console.log('error', err);
    console.log('results', results);
    var options = {
      view: views.INSP_F2,
      data: {
        ttdata: results,
        sessionID: req.sessionID,
        user: req.user,
        title: 'New IC Inspection'
      }
    };
    response(options, req, res);
  });
}

function getICI3(req, res, next) {
  async.parallel({
    crops: function(cb) {
      ttsql.getCrops(cb);
    },
  }, function(err, results) {
    console.log('error', err);
    console.log('results', results);
    var options = {
      view: views.INSP_F3,
      data: {
        ttdata: results,
        sessionID: req.sessionID,
        user: req.user,
        title: 'New IC Inspection'
      }
    };
    response(options, req, res);
  });

}

function postICI(req, res, next) {
  // TODO: extract all data required for following waterfall and parallel insertions
  // temp user assignment tbreoved
  // req.user = {};
  var inspData = dataUtil.pickData(req.body, inspFields);
  inspData.fieldInspection.created_by = req.user.user_id || 1;
  inspData.fieldInspection.last_updated_by = req.user.user_id || 1;
  if (req.files) {
    inspData.fieldInspection.file_path = req.files.picture[0].filename;
  }

  async.waterfall([
    function(cb) {
      inspsql.addIci(inspData.fieldInspection, cb);
    },
    function(results, cb) {
      // TODO: prepare insertion data for all the parallel functions
      var inspId = results.insertId;
      dataUtil.addForEach(inspData.animalHusbandry, 'field_insp_id', inspId);
      dataUtil.addForEach(inspData.stockDetails, 'field_insp_id', inspId);
      dataUtil.addForEach(inspData.cropTransc, 'field_insp_id', inspId);
      inspData.inspectionAnalysis.field_insp_id = inspId;
      inspData.smiMapping.field_insp_id = inspId;
      inspData.equiMapping.field_insp_id = inspId;

      async.parallel([
        function(cb) {
          inspsql.addAnimalHusbandry(inspData.animalHusbandry, cb);
        },
        function(cb) {
          inspsql.addStockDetails(inspData.stockDetails, cb);
        },
        function(cb) {
          inspsql.addCropTransc(inspData.cropTransc, cb);
        },
        function(cb) {
          inspsql.addInspAnalysis(inspData.inspectionAnalysis, cb);
        },
        function(cb) {
          inspsql.addSmiMap(inspData.smiMapping, cb);
        },
        function(cb) {
          inspsql.addEquiMap(inspData.equiMapping, cb);
        },
      ], function(err, results) {
        console.log('error from parallel: ', err);
        console.log('results from parallel: ', results);
        cb(null, 'done111');
      });
    },

  ], function(err, results) {
    console.log('error from waterfall: ', err);
    console.log('results afer waterfall:', results);
    if (!err) {
      res.send("success!");
    }
  });
}

function getFieldDetails(req, res, next) {

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
    res.json(enrolData);
    /*  var options = {
    view: views.ACTION_FIELDS,
    data: {
    ttdata: enrolData,
    sessionID: req.sessionID,
    user: req.user,
    title: 'Field Action'
  }
};
response(options, req, res);*/
})
}

function postIciUpdate(req, res, next) {
  // req.user = {};

  var inspData = dataUtil.pickData(req.body, inspFields);
  // inspData.fieldInspection.created_by = req.user.user_id || 1;
  inspData.fieldInspection.last_updated_by = req.user.user_id || 1;
  dataUtil.addForEach(inspData.animalHusbandry, 'field_insp_id', inspData.fieldInspection.field_insp_id);
  dataUtil.addForEach(inspData.stockDetails, 'field_insp_id', inspData.fieldInspection.field_insp_id);
  dataUtil.addForEach(inspData.cropTransc, 'field_insp_id', inspData.fieldInspection.field_insp_id);
  inspData.inspectionAnalysis.field_insp_id = inspData.fieldInspection.field_insp_id;
  inspData.smiMapping.field_insp_id = inspData.fieldInspection.field_insp_id;
  inspData.equiMapping.field_insp_id = inspData.fieldInspection.field_insp_id;
  if (req.files) {
    inspData.fieldInspection.file_path = req.files.picture[0].filename;
  }

  async.parallel([
    function(cb) {
      inspsql.updateIci(inspData.fieldInspection, cb);
    },
    function(cb) {
      inspsql.updateAnimalHusbandry(inspData.animalHusbandry, cb);
    },
    function(cb) {
      inspsql.updateStockDetails(inspData.stockDetails, cb);
    },
    function(cb) {
      inspsql.updateCropTransc(inspData.cropTransc, cb);
    },
    function(cb) {
      inspsql.updateInspAnalysis(inspData.inspectionAnalysis, cb);
    },
    function(cb) {
      inspsql.updateSmiMap(inspData.smiMapping, cb);
    },
    function(cb) {
      inspsql.updateEquiMap(inspData.equiMapping, cb);
    },
  ], function(err, results) {
    console.log('error from parallel: ', err);
    console.log('results from parallel: ', results);
    if (!err) {
      res.send("success!");
    }
  });
}

function getIciData(req, res, next) {
  console.log(" got req for insp : param id  :", req.query.id);
  var pk = inspFields.fieldInspection.pk;
  var where = {};
  where[pk] = req.query.id;
  console.log('where:', where);
  async.parallel({
    insp: function(cb) {
      inspsql.fetchIci(where, cb);
    },
    ah: function(cb) {
      inspsql.fetchAnimalHusbandry(where, cb);
    },
    stock: function(cb) {
      inspsql.fetchStockDetails(where, cb);
    },
    cropTransc: function(cb) {
      inspsql.fetchCropTransc(where, cb);
    },
    ia: function(cb) {
      inspsql.fetchInspAnalysis(where, cb);
    },
    smi: function(cb) {
      inspsql.fetchSmiMap(where, cb);
    },
    equi: function(cb) {
      inspsql.fetchEquiMap(where, cb);
    }
  }, function formatResult(err, results) {
    var inspData = {};
    console.log('results:', results);
    Object.assign(inspData, results.insp[0], results.ia[0], results.smi[0], results.equi[0]);
    inspData.animalHusbandry = results.ah;
    inspData.stockDetails = results.stock;
    inspData.cropTransc = results.cropTransc;
    console.log('results after merge:', inspData);
    console.log('inspdata :'+JSON.stringify(inspData.ref_points));
    var options = {
      view: views.INSP_VIEW,
      data: {
        ttdata: inspData,
        sessionID: req.sessionID,
        user: req.user,
        title: 'Inspection Details'
      }
    };
    response(options, req, res);
    // res.json(inspData);
  });
}

function getIciList(req, res, next) {
  // TODO: 1. admin or not
  // 2. admin fetch all : send field officers  empty
  // 3. if supervisor :get inspectors if  empty ,just pass if not send to get inspection list
  console.log("req.user.role_id == 2:", req.user.role_id == 2);
  async.waterfall([
    function(cb) {
      if (req.user.role_id == 2) {
        usersql.getInspectors(req.user.user_id, function(err, results) {
          console.log("list of inspectors:under ", results);
          results.push(req.user.user_id);
          console.log('[req.user.user_id].push(results)==', results);
          cb(null, results);
        });
      } else if (req.user.role_id == 3) {
        cb(null, [req.user.user_id]);
      } else {
        cb(null, null);
      }
    },
    function(results, cb) {
      if (req.user.role_id == 1) {
        console.log('==========inside waterfall 2 :admin :');
        insplist.getInspectionList(null, cb);
      } else if (results.length) {
        console.log("inspectors:=", results);
        insplist.getInspectionList(results, cb);
      } else {
        cb(null, []);
      }
    }
  ],
  function(err, results) {
    var options = {
      view: views.INSP_LIST,
      data: {
        ttdata: results,
        user: req.user,
        title: 'Inspection List'
      }
    };
    response(options, req, res);
    // res.json(results);
  });
  // inspsql.fetchAllInspections();
}

function getIciSearch(req, res, next) {}


function postIciDelete(req, res, next) {
  // req.user = {};
  var inspData = {
    field_insp_id: req.body.field_insp_id,
    last_updated_by: req.user.user_id || 1,
    status_id: 3
  };
  inspsql.updateIci(inspData, function(err, results) {
    res.send('successfully deactivated inspection');
  });
}

exports.getICI1 = getICI1;
exports.getICI2 = getICI2;
exports.getICI3 = getICI3;

exports.postICI = postICI;

exports.getIciList = getIciList;
exports.getIciSearch = getIciSearch;
exports.getIciData = getIciData;
exports.postIciUpdate = postIciUpdate;
exports.postIciDelete = postIciDelete;
exports.getFieldDetails = getFieldDetails;

// getICI2();
