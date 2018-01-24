var db = require('./mysqldb');

function getCrops(cb) {
  db.fetchAll('crop_mstr', cb);
}

function getPpms(cb) {
  db.fetchAll('plant_protect_meth', cb);
}

function getSmis(cb) {
  db.fetchAll('src_method_irrigation', cb);
}

function getSnms(cb) {
  db.fetchAll('soil_nutri_meth', cb);
}

function getEquipments(cb) {
  db.fetchAll('farm_equipment', cb);
}

exports.getCrops = getCrops;
exports.getPpms = getPpms;
exports.getSmis = getSmis;
exports.getSnms = getSnms;
exports.getEquipments = getEquipments;
