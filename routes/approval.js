var auth = require('../controllers/auth/auth');
var approval = require('../controllers/approval');


module.exports = function(api) {
  api.get('/approval/list', auth.isLoggedIn, approval.getEnrollmentsForApprovals);
  //api.get('/approval/field', auth.isLoggedIn, approval.getEnrollmentsForApprovals);

  api.post('/approval/approve/:id', auth.isLoggedIn, approval.approveEnrollment);
  api.post('/approval/reject/:id', auth.isLoggedIn, approval.rejectEnrollment);

  api.post('/approval/approve/farmers/:id', auth.isLoggedIn, approval.approveFarmer);
  api.post('/approval/reject/farmers/:id', auth.isLoggedIn, approval.rejectFarmer);
  api.post('/approval/approve/fields/:id', auth.isLoggedIn, approval.approveField);
  api.post('/approval/reject/fields/:id', auth.isLoggedIn, approval.rejectField);
};
