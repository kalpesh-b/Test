var db = require('./mysqldb');
var enrolFields = require('../models/enrolFields');
// function getUserRole(uid, done) {
//     db.getUserRole(uid, done);
// }

function getFarmer(where, done) {
  db.fetch(enrolFields.farmer.table, where, done);
}

function getFields(where, done) {
  db.fetch('field_mstr', where, done);
}

function getFarmers(where, done) {
  db.fetch(enrolFields.farmer.table, where, done);
}

function addFarmer(farmerData, done) {
  db.insert('FARMER_MSTR', farmerData, done);
}

function addField(fieldData, done) {
  console.log('field data in sql :' +JSON.stringify(fieldData));
  db.insert('FIELD_MSTR', fieldData, done);
}

function addGcpMapping(mappingData, done) {
  db.insert('GCP_MAPPING', mappingData, done);
}

function addPpmMapping(mappingData, done) {
  db.insert('PPM_MAPPING', mappingData, done);
}

function addSnmMappping(mappingData, done) {
  db.insert('SNM_MAPPING', mappingData, done);
}

function addCropsMapping(mappingData, done) {
  db.bulkInsert(enrolFields.fields.fields.crops, mappingData, done);
}

function updateFarmer(farmerData, done) {
  db.update(enrolFields.farmer, farmerData, done);
}

function updateField(fieldData, done) {
  db.update(enrolFields.fields.fields.field, fieldData, done);
}

function updateGcpMapping(gcpData, done) {
  console.log(gcpData);
  db.update(enrolFields.fields.fields.gcp, gcpData, done);
}

function updateSnmMappping(snmData, done) {
  db.update(enrolFields.fields.fields.snm, snmData, done);
}

function updatePpmMapping(ppmData, done) {
  db.update(enrolFields.fields.fields.ppm, ppmData, done);
}

function updateCropsMapping(fieldData, fieldId, done) {
  var fk = enrolFields.fields.fields.crops.fk;
  var where = {};
  where[fk] = fieldId;
  db.delete(enrolFields.fields.fields.crops.table, where, function(err, results) {});
  // db.update(enrolFields.fields.fields.crops, fieldData, done);
  db.bulkInsert(enrolFields.fields.fields.crops, fieldData, done);
}

exports.updateFarmer = updateFarmer;
exports.updateField = updateField;
exports.updateGcpMapping = updateGcpMapping;
exports.updateSnmMappping = updateSnmMappping;
exports.updatePpmMapping = updatePpmMapping;
exports.updateCropsMapping = updateCropsMapping;

exports.getFarmer = getFarmer;
exports.getFields = getFields;

exports.getFarmers = getFarmers;
exports.addFarmer = addFarmer;
exports.addField = addField;
exports.addGcpMapping = addGcpMapping;
exports.addCropsMapping = addCropsMapping;
exports.addSnmMappping = addSnmMappping;
exports.addPpmMapping = addPpmMapping;
