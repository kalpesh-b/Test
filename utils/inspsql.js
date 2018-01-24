var db = require('./mysqldb');
var inspFields = require('../models/inspFields');

function getInspectors(user_id, cb) {
  // TODO:
  cb();

}

function fetchAllInspections(cb) {
  db.fetchAll(inspFields.fieldInspection.table, cb);
}

function addIci(icidata, cb) {
  db.insert(inspFields.fieldInspection.table, icidata, cb);
}

function addAnimalHusbandry(ahdata, cb) {
  db.bulkInsert(inspFields.animalHusbandry, ahdata, cb);
}

function addStockDetails(stdata, cb) {
  db.bulkInsert(inspFields.stockDetails, stdata, cb);
}

function addCropTransc(ctdata, cb) {
  db.bulkInsert(inspFields.cropTransc, ctdata, cb);
}

function addInspAnalysis(iaData, cb) {
  db.insert(inspFields.inspectionAnalysis.table, iaData, cb);
}

function addSmiMap(smdata, cb) {
  db.insert(inspFields.smiMapping.table, smdata, cb);
}

function addEquiMap(eqdata, cb) {
  db.insert(inspFields.equiMapping.table, eqdata, cb);
}

function updateIci(icidata, cb) {
  db.update(inspFields.fieldInspection, icidata, cb);
}

function updateAnimalHusbandry(ahdata, cb) {
  db.bulkInsertOrUpdate(inspFields.animalHusbandry, ahdata, cb);
}

function updateStockDetails(stdata, cb) {
  db.bulkInsertOrUpdate(inspFields.stockDetails, stdata, cb);
}

function updateCropTransc(ctdata, cb) {
  db.bulkInsertOrUpdate(inspFields.cropTransc, ctdata, cb);
}

function updateInspAnalysis(iaData, cb) {
  db.update(inspFields.inspectionAnalysis, iaData, cb);
}

function updateSmiMap(smdata, cb) {
  db.update(inspFields.smiMapping, smdata, cb);
}

function updateEquiMap(eqdata, cb) {
  db.update(inspFields.equiMapping, eqdata, cb);
}
// fetch
function fetchIci(where, cb) {
  db.fetch(inspFields.fieldInspection.table, where, cb);
}

function fetchAnimalHusbandry(where, cb) {
  db.fetch(inspFields.animalHusbandry.table, where, cb);
}

function fetchStockDetails(where, cb) {
  db.fetch(inspFields.stockDetails.table, where, cb);
}

function fetchCropTransc(where, cb) {
  db.fetch(inspFields.cropTransc.table, where, cb);
}

function fetchInspAnalysis(where, cb) {
  db.fetch(inspFields.inspectionAnalysis.table, where, cb);
}

function fetchSmiMap(where, cb) {
  db.fetch(inspFields.smiMapping.table, where, cb);
}

function fetchEquiMap(where, cb) {
  db.fetch(inspFields.equiMapping.table, where, cb);
}
exports.fetchAllInspections = fetchAllInspections;

exports.getInspectors = getInspectors;
exports.fetchIci = fetchIci;
exports.fetchAnimalHusbandry = fetchAnimalHusbandry;
exports.fetchStockDetails = fetchStockDetails;
exports.fetchCropTransc = fetchCropTransc;
exports.fetchInspAnalysis = fetchInspAnalysis;
exports.fetchSmiMap = fetchSmiMap;
exports.fetchEquiMap = fetchEquiMap;

exports.addIci = addIci;
exports.addAnimalHusbandry = addAnimalHusbandry;
exports.addStockDetails = addStockDetails;
exports.addCropTransc = addCropTransc;
exports.addInspAnalysis = addInspAnalysis;
exports.addSmiMap = addSmiMap;
exports.addEquiMap = addEquiMap;


exports.updateIci = updateIci;
exports.updateAnimalHusbandry = updateAnimalHusbandry;
exports.updateStockDetails = updateStockDetails;
exports.updateCropTransc = updateCropTransc;
exports.updateInspAnalysis = updateInspAnalysis;
exports.updateSmiMap = updateSmiMap;
exports.updateEquiMap = updateEquiMap;
