var auth = require('../controllers/auth/auth');
var enroll = require('../controllers/enrollments');
var gcp = require('../controllers/gcp');
var upload = require('../config/multerUploads');


module.exports = function(api) {
  //api.get('/enroll/new', auth.isLoggedIn, enroll.getNewFarmerEnrollment);
  api.get('/gcp/list', auth.isLoggedIn, gcp.getGcps);
  api.get('/ppm/list', auth.isLoggedIn, gcp.getPpms);
  api.get('/snm/list', auth.isLoggedIn, gcp.getSnms);
  api.get('/crop/list', auth.isLoggedIn, gcp.getCrops);
  api.get('/enroll/new', auth.isLoggedIn, enroll.getNewFarmerEnrollment);

  var filePathUpload = upload.multer.fields([{
    name: 'picture',
    maxCount: 1
  }]);
  api.get('/enroll/listFields/:id', auth.isLoggedIn, enroll.getEnrolledFieldDetails);
  api.get('/enroll/update/:id', auth.isLoggedIn, enroll.getEnrolledFarmerUpdate);// getUpdateFarmerEnrollment getEnrolledFarmerUpdate
  api.post('/enroll/new', auth.isLoggedIn, filePathUpload, upload.compressImages, enroll.postNewFarmerEnrollment);
  api.get('/enroll/list', auth.isLoggedIn, enroll.getAllEnrollmentsHighlights);
  api.get('/enroll/search/:query', auth.isLoggedIn, enroll.getSearchEnrolledFarmers);
  api.get('/enroll/details/:id', auth.isLoggedIn, enroll.getEnrolledFarmerDetails);
  api.post('/enroll/update', auth.isLoggedIn, filePathUpload, upload.compressImages, enroll.postUpdateFarmerEnrollment);
  api.post('/enroll/delete/farmer/:id', auth.isLoggedIn, enroll.postDeleteFarmerEnrollment);
  api.post('/enroll/delete/field/:id', auth.isLoggedIn, enroll.postDeleteFieldEnrollment);
};
