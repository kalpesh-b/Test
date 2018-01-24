var users = require('../controllers/users');
var mail = require('../controllers/auth/mail');
var auth = require('../controllers/auth/auth');
var upload = require('../config/multerUploads');

module.exports = function(api) {
  api.get('/user/admin', users.isAdminEmpty, users.getAdd);
  api.get('/user/add', auth.isLoggedIn, users.getAdd);
  api.get('/user/list', auth.isLoggedIn, users.getList);
  api.get('/user/view', auth.isLoggedIn, users.getUser);
  api.get('/user/update', auth.isLoggedIn, users.getUpdate);

  var cpUpload = upload.multer.fields([{
    name: 'picture',
    maxCount: 1
  }]);

  api.get('/user/search', auth.isLoggedIn, users.getSearchList);
  api.post('/user/admin', users.isAdminEmpty, cpUpload, upload.compressImages, users.postAdd, mail.sendPwResetMail);
  api.post('/user/add', auth.isLoggedIn, cpUpload, upload.compressImages, users.postAdd, mail.sendPwResetMail);
  api.post('/user/update', auth.isLoggedIn, cpUpload, upload.compressImages, users.postUpdate);
  api.post('/user/delete', auth.isLoggedIn, users.postDelete);

};
