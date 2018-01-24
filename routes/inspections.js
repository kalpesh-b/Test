var auth = require('../controllers/auth/auth');
var insp = require('../controllers/inspections');
var upload = require('../config/multerUploads');

var enrolsql = require('../utils/enrolsql');
var ttsql = require('../utils/ttsql');
var specificsql = require('../utils/specificsql');

module.exports = function(api) {

  api.get('/ici/new/f1', auth.isLoggedIn, insp.getICI1);
  api.get('/ici/new/f2', auth.isLoggedIn, insp.getICI2);
  api.get('/ici/new/f3', auth.isLoggedIn, insp.getICI3);

  var cpUpload = upload.multer.fields([{
    name: 'picture',
    maxCount: 1
  }]);
  api.post('/ici/new', auth.isLoggedIn, cpUpload, upload.compressImages, insp.postICI);

  api.get('/ici/fieldList', auth.isLoggedIn, insp.getFieldDetails);
  api.get('/ici/list', auth.isLoggedIn, insp.getIciList);
  api.get('/ici/search', auth.isLoggedIn, insp.getIciSearch);
  api.get('/ici/view', auth.isLoggedIn, insp.getIciData);
  api.get('/ici/update', auth.isLoggedIn, insp.getIciData);
  // api.get('/ici/update/f2', insp.getIciData);
  // api.get('/ici/update/f3', insp.getIciData);

  api.post('/ici/update', auth.isLoggedIn, cpUpload, upload.compressImages, insp.postIciUpdate);
  api.post('/ici/delete', auth.isLoggedIn, insp.postIciDelete);


};
