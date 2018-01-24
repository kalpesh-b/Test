var express = require('express');
// var status = require('http-status');

module.exports = function(app) {

  var api = express.Router();
  require('./auth')(api);
  require('./users')(api);
  require('./enrollments')(api);
  require('./inspections')(api);
  require('./testing')(api);
  require('./approval')(api);


  app.use('/', api);

};
