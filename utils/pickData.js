// jshint esversion:6
var _ = require('lodash');
// var enrolFields = require('./enrolFields');
// var inspFields = require('./inspFields');

function pickData1(reqbody, dataFields) {
  var data = {};
  _.forEach(dataFields, function(value, key) {
    if (value.node) {
      console.log('arrprop:reqbody[value.node]', value.node, ':', reqbody[value.node]);
      data[key] = reqbody[value.node].map(obj => _.pick(obj, value.fields));
    } else {
      data[key] = _.pick(reqbody, value.fields);
    }
  });
  return data;
}

function pickData(reqbody, fields) {
  //console.log('In pickdata :'+JSON.stringify(fields));
  let data = {};
  _.forEach(fields, (value, key) => {
    if (value.node && !value.table) {
      data[key] = reqbody[value.node].map(obj => {
        //  console.log('obj :'+JSON.stringify(obj)+' value.fields :'+JSON.stringify(value.fields));
        return pickData(obj, value.fields);
      });
    } else if (value.node && value.table) {
      console.log(reqbody[value.node]);
      //  console.log('obj :'+JSON.stringify(obj)+' value.fields :'+JSON.stringify(value.fields));
      data[key] = reqbody[value.node].map(obj => _.pick(obj, value.fields));
    } else {
      console.log('reqbody :'+JSON.stringify(reqbody)+' value.fields :'+JSON.stringify(value.fields));
      data[key] = _.pick(reqbody, value.fields);
    }
  });
  console.log('data in pick :'+JSON.stringify(data));
  return data;
}

function addForEach(arr, prop, value) {
  arr.forEach(obj => obj[prop] = value);
}

function getValuesArray(fields, objArray) {
  console.log("In getValuesArray map");
  return _.map(objArray, function(obj) {
    return _.map(fields, function(key) {
      return obj[key];
    });
  });
}

function append(table, fields, alias) {
  return fields.reduce((str, col) => str + ',' + table + '.' + col + (alias ? (' ' + table + '_' + col) : '') + ' ', '').replace(',', '');
}



exports.pickData = pickData;
exports.addForEach = addForEach;
exports.getValuesArray = getValuesArray;
exports.append = append;
